import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'fluxloc_db';
const dbUser = process.env.DB_USER || 'fluxloc_user';
const dbPassword = process.env.DB_PASSWORD || 'fluxloc_pass';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL database:', error);
    process.exit(1);
  }
};
