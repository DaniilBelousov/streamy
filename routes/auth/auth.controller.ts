import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import schemas from './auth.schema.js';
import Service from './auth.service.js';
import { Unauthorized } from '../../lib/errors.js';

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
        signed: true,
      });
      res.setCookie('refreshToken', refreshToken, {
        path: '/',
        signed: true,
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
        signed: true,
      });
      res.setCookie('refreshToken', refreshToken, {
        path: '/',
        signed: true,
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
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) throw new Unauthorized();
      const { valid, value } = req.unsignCookie(refreshToken);
      if (!valid || !value) throw new Unauthorized();
      const { accessToken, refreshToken: newRefreshToken } = await service.refresh(value);
      res.setCookie('token', accessToken, {
        path: '/',
        signed: true,
      });
      res.setCookie('refreshToken', newRefreshToken, {
        path: '/',
        signed: true,
      });
      res.statusCode = 201;
      res.send();
    },
  });
}
