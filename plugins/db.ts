import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import knexPkg, { type Knex } from 'knex';

import { db } from '../lib/config.js';
import { Users, AccessKeys } from '../lib/db/index.js';

const { knex } = knexPkg;
const { APP_STAGE } = process.env;

export type Db = Knex<any, unknown[]>;

const dbPlugin = async function (app: FastifyInstance, _: FastifyPluginOptions) {
  const connect: Db = knex({
    client: 'pg',
    connection: {
      ...db[APP_STAGE],
    },
  });
  const models = {
    Users: new Users(connect),
    AccessKeys: new AccessKeys(connect),
  };

  app.decorate('knex', connect);
  app.decorate('models', models);
};

export default fp(dbPlugin);
