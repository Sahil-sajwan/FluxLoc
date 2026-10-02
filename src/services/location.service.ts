import { kafkaProducer } from '../config/kafka';
import { redisClient } from '../config/redis';
import { latLngToH3Index, getNearbyH3Cells } from '../utils/h3.utils';
import { DriverStatus } from '../models/driver';

export interface LocationPayload {
  driverId: string;
  latitude: number;
  longitude: number;
  status?: DriverStatus;
  timestamp?: number;
}

export class LocationService {
  private topic = process.env.KAFKA_TOPIC_LOCATION_UPDATES || 'driver-location-updates';

  /**
   * Push driver location update to Kafka
   */
  public async pushLocationUpdate(payload: LocationPayload): Promise<void> {
    const data = {
      ...payload,
      timestamp: payload.timestamp || Date.now(),
    };

    try {
      await kafkaProducer.send({
        topic: this.topic,
        messages: [
          {
            key: payload.driverId,
            value: JSON.stringify(data),
          },
        ],
      });
      console.log(`[Kafka] Pushed location update for driver ${payload.driverId}`);
    } catch (error) {
      console.error(`[Kafka] Error pushing location update for driver ${payload.driverId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch nearby drivers within specified radius (~10km default)
   */
  public async getNearbyDrivers(lat: number, lng: number, kRingDistance: number = 7) {
    const centerH3Index = latLngToH3Index(lat, lng);
    const h3Cells = getNearbyH3Cells(centerH3Index, kRingDistance);

    const nearbyDriversMap = new Map<string, any>();

    for (const cell of h3Cells) {
      // Fetch set of driver IDs in this H3 cell from Redis
      const driverIds = await redisClient.sMembers(`h3:${cell}`);
      
      for (const driverId of driverIds) {
        if (!nearbyDriversMap.has(driverId)) {
          const driverData = await redisClient.hGetAll(`driver:${driverId}`);
          if (driverData && Object.keys(driverData).length > 0) {
            // Only include available/active drivers
            if (!driverData.status || driverData.status === DriverStatus.AVAILABLE) {
              nearbyDriversMap.set(driverId, {
                driverId,
                lat: parseFloat(driverData.lat),
                lng: parseFloat(driverData.lng),
                status: driverData.status || DriverStatus.AVAILABLE,
                lastUpdated: parseInt(driverData.updatedAt || '0', 10),
                h3Index: cell,
              });
            }
          }
        }
      }
    }

    return Array.from(nearbyDriversMap.values());
  }
}

export const locationService = new LocationService();
