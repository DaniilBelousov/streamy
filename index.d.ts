import { type Db } from './plugins/db';
import { Users } from './lib/db/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: Db;
    models: {
      Users: Users;
    };
  }
}
