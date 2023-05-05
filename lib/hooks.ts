import type { FastifyRequest } from 'fastify';

import { auth } from './config.js';
import { Unauthorized } from './errors.js';

export const jwtAuth = async (req: FastifyRequest) => {
  try {
    const { whitelist } = auth;
    if (!whitelist.includes(req.url)) {
      await req.jwtVerify({ onlyCookie: true });
    }
  } catch (error) {
    req.log.error('Auth Error:', error);
    throw new Unauthorized();
  }
};
