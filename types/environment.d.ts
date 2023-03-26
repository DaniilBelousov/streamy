export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: number;
      PSQL_DB_HOST: string;
      PSQL_DB_NAME: string;
      PSQL_DB_USER: string;
      PSQL_DB_PASS: string;
      APP_STAGE: 'dev';
    }
  }
}
