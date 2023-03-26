import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import schemas from './users.schema.js';
import Service from './users.service.js';

export default async function (app: FastifyInstance) {
  const service = new Service(app);

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users',
    schema: schemas.GET,
    handler: async (_, res) => {
      const users = await service.get();
      res.statusCode = 200;
      res.send(users);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/users',
    schema: schemas.POST,
    handler: async (req, res) => {
      const { body } = req;
      const userId = service.create(body);
      res.statusCode = 201;
      res.send({ userId });
    },
  });
}
