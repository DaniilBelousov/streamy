import type { AppStages } from '../types/index.js';
const { PSQL_DB_HOST, PSQL_DB_NAME, PSQL_DB_USER, PSQL_DB_PASS } = process.env;

type DbConfig = {
  [key in AppStages]: {
    host: string;
    database: string;
    user: string;
    password: string;
  };
};

export const db: DbConfig = {
  dev: {
    host: PSQL_DB_HOST,
    database: PSQL_DB_NAME,
    user: PSQL_DB_USER,
    password: PSQL_DB_PASS,
  },
};

export const hashConfig = {
  scryptParams: { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
  saltLen: 32,
  keyLen: 64,
};

export const auth = {
  whitelist: ['/sign-up', '/sign-in', '/refresh'],
};
