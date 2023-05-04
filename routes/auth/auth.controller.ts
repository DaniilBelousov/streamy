import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import schemas from './auth.schema.js';
import Service from './auth.service.js';

export default async function (app: FastifyInstance) {
  const service = new Service(app);

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/sign-up',
    schema: schemas.signUp,
    handler: async (req, res) => {
      const { accessToken, refreshToken } = await service.signUp(req.body);
      res.setCookie('token', accessToken, {
        path: '/',
      });
      res.setCookie('refreshToken', refreshToken, {
        path: '/',
      });
      res.statusCode = 201;
      res.send({ status: 'OK' });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/sign-in',
    schema: schemas.signIn,
    handler: async (req, res) => {
      const { accessToken, refreshToken } = await service.signIn(req.body);
      res.setCookie('token', accessToken, {
        path: '/',
      });
      res.setCookie('refreshToken', refreshToken, {
        path: '/',
      });
      res.statusCode = 201;
      res.send();
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/refresh',
    schema: schemas.refresh,
    handler: async (req, res) => {
      const { accessToken, refreshToken } = await service.refresh(req.body);
      res.setCookie('token', accessToken, {
        path: '/',
      });
      res.setCookie('refreshToken', refreshToken, {
        path: '/',
      });
      res.statusCode = 201;
      res.send();
    },
  });
}
