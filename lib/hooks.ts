import type { FastifyRequest, FastifyReply } from 'fastify';

import { auth } from '../lib/config.js';

export const jwtAuth = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { whitelist } = auth;
    if (!whitelist.includes(req.url)) {
      await req.jwtVerify({ onlyCookie: true });
    }
  } catch (error) {
    console.log('Auth Error:', error);
    // const unauthorizedError = new Unauthorized();
    // res.statusCode = unauthorizedError.statusCode;
    res.send(error);
  }
};
