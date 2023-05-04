import type { Knex } from 'knex';
import { db } from './lib/config';
import { AppStages } from './types/index';

// remove type from package.json to successfully run migration

const { APP_STAGE = AppStages.DEV } = process.env;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      ...db[APP_STAGE],
    },
    migrations: {
      directory: './lib/db/migrations',
    },
  },
};

module.exports = config;
