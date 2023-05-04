import type { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

const { JWT_SECRET } = process.env;

const jwtPlugin = async (app: FastifyInstance) => {
  app.register(fastifyJwt, {
    secret: JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });
};

export default fp(jwtPlugin);
