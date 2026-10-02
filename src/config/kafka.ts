import { Kafka, Producer, Consumer } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const brokers = (process.env.KAFKA_BROKERS || '127.0.0.1:9092').split(',');
const clientId = process.env.KAFKA_CLIENT_ID || 'fluxloc-service';

export const kafka = new Kafka({
  clientId,
  brokers,
});

export const kafkaProducer: Producer = kafka.producer();
export const kafkaConsumer = (groupId: string): Consumer => kafka.consumer({ groupId });

export const connectKafkaProducer = async (): Promise<void> => {
  try {
    await kafkaProducer.connect();
    console.log('✅ Kafka Producer connected successfully.');
  } catch (error) {
    console.error('❌ Failed to connect Kafka Producer:', error);
  }
};
