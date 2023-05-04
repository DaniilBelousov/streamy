import '@fastify/jwt';
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

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; nickname: string };
    user: {
      id: string;
      nickname: string;
    };
  }
}
