import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import schemas from './users.schemas';

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users',
    schema: schemas.GET,
    handler: (req, res) => {
      res.statusCode = 200;
      res.send(req.query.name);
    },
  });
}
