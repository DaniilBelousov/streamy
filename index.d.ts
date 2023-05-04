import { type Db } from './plugins/db';
import { Users, AccessKeys } from './lib/db/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: Db;
    models: {
      AccessKeys: AccessKeys;
      Users: Users;
    };
  }
}
