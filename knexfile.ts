import * as dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    port: Number(process.env.DB_PORT || 5432),
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'db/migrations',
  },
  seeds: {
    directory: 'db/seeders',
  },
};
export default knexConfig;
