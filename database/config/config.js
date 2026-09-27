require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'fluxloc_user',
    password: process.env.DB_PASSWORD || 'fluxloc_pass',
    database: process.env.DB_NAME || 'fluxloc_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.DB_USER || 'fluxloc_user',
    password: process.env.DB_PASSWORD || 'fluxloc_pass',
    database: process.env.DB_NAME_TEST || 'fluxloc_db_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false
  }
};
