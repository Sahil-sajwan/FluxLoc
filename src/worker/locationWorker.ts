import { kafkaConsumer } from '../config/kafka';
import { redisClient, connectRedis } from '../config/redis';
import { connectDatabase } from '../config/database';
import { Driver, DriverStatus } from '../models';
import { latLngToH3Index } from '../utils/h3.utils';
import { LocationPayload } from '../services/location.service';

const TOPIC = process.env.KAFKA_TOPIC_LOCATION_UPDATES || 'driver-location-updates';

export const startLocationWorker = async () => {
  console.log('🚀 Initializing Location Worker...');
  await connectDatabase();
  await connectRedis();

  const consumer = kafkaConsumer('location-worker-group');

  try {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

    console.log(`📡 Location Worker subscribed to topic: ${TOPIC}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        try {
          const payload: LocationPayload = JSON.parse(message.value.toString());
          const { driverId, latitude, longitude, status, timestamp } = payload;

          // 1. Calculate H3 Index
          const newH3Index = latLngToH3Index(latitude, longitude);

          // 2. Retrieve previous location metadata from Redis
          const oldDriverData = await redisClient.hGetAll(`driver:${driverId}`);
          const oldH3Index = oldDriverData?.h3Index;

          // 3. Remove driver from old H3 cell set if cell changed
          if (oldH3Index && oldH3Index !== newH3Index) {
            await redisClient.sRem(`h3:${oldH3Index}`, driverId);
          }

          // 4. Add driver to new H3 cell set
          await redisClient.sAdd(`h3:${newH3Index}`, driverId);

          // 5. Update driver metadata in Redis Hash
          const redisUpdate: Record<string, string> = {
            lat: latitude.toString(),
            lng: longitude.toString(),
            h3Index: newH3Index,
            updatedAt: (timestamp || Date.now()).toString(),
          };

          if (status) {
            redisUpdate.status = status;
          }

          await redisClient.hSet(`driver:${driverId}`, redisUpdate);

          // 6. If status changed, update PostgreSQL database
          if (status && status !== oldDriverData?.status) {
            await Driver.update(
              { status: status as DriverStatus },
              { where: { id: driverId } }
            );
            console.log(`[DB] Updated driver ${driverId} status to ${status}`);
          }

          console.log(
            `[Worker] Driver ${driverId} updated -> Lat: ${latitude}, Lng: ${longitude}, H3: ${newH3Index}`
          );
        } catch (err) {
          console.error('[Worker] Error processing location update:', err);
        }
      },
    });
  } catch (error) {
    console.error('[Worker] Failed to start Kafka consumer:', error);
  }
};

// Execute if run directly
if (require.main === module) {
  startLocationWorker();
}
