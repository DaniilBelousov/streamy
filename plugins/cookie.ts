import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';

const { COOKIE_SECRET } = process.env;

const cookiePlugin = async (app: FastifyInstance) => {
  app.register(cookie, {
    secret: COOKIE_SECRET,
  });
};

export default fp(cookiePlugin);
