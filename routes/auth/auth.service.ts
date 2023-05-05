import { randomUUID } from 'node:crypto';

import type z from 'zod';
import type { FastifyInstance } from 'fastify';
import type { UserType } from '@fastify/jwt';

import { validatePassword, hashPassword } from '../../lib/utils.js';
import { auth } from '../../lib/config.js';
import type schemas from './auth.schema.js';
import type { IUser } from '../../lib/db/index.js';
import { NotFound, BadRequest } from '../../lib/errors.js';
import {
  ERROR_CODE_ALREADY_EXISTS,
  ERROR_CODE_INVALID_PASSWORD,
  ERROR_MESSAGE_USER_EXISTS,
  ERROR_MESSAGE_USER_NOT_FOUND,
  ERROR_MESSAGE_INVALID_PASSWORD,
} from '../../lib/constants.js';

type SignUpBody = z.infer<typeof schemas.signUp.body>;
type SignInBody = z.infer<typeof schemas.signIn.body>;

interface AccessTokens {
  accessToken: string;
  refreshToken: string;
}

class Service {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  async signUp(data: SignUpBody): Promise<AccessTokens> {
    const {
      models: { Users },
    } = this.app;

    const { password, email, nickname } = data;
    const user = await Users.read().select('*').where({ email }).first();
    if (user) throw new BadRequest({ message: ERROR_MESSAGE_USER_EXISTS });
    const passwordHash = await hashPassword(password);
    const id = await Users.create({ ...data, password: passwordHash });

    return this.renewTokens({ id, nickname });
  }

  async signIn({ password, email }: SignInBody): Promise<AccessTokens> {
    const {
      models: { Users },
    } = this.app;

    const user = await Users.read().select('*').where({ email }).first();
    if (!user) {
      throw new NotFound({
        message: ERROR_MESSAGE_USER_NOT_FOUND,
        code: ERROR_CODE_ALREADY_EXISTS,
      });
    }
    const isValid = await validatePassword(password, user.password);
    if (!isValid) {
      throw new BadRequest({
        message: ERROR_MESSAGE_INVALID_PASSWORD,
        code: ERROR_CODE_INVALID_PASSWORD,
      });
    }
    const { id, nickname } = user;

    return this.renewTokens({ id, nickname });
  }

  async refresh(refreshToken: string) {
    const {
      models: { AccessKeys, Users },
    } = this.app;

    const row = await AccessKeys.read()
      .select('*')
      .where({ refreshToken })
      .innerJoin<IUser>(
        'users',
        `${AccessKeys.tableName}.userId`,
        `${Users.tableName}.id`,
      )
      .first();
    if (!row) throw Error('Unauthorized');
    const { id, nickname } = row;

    return this.renewTokens({ id, nickname }, refreshToken);
  }

  private async renewTokens(
    user: UserType,
    oldRefreshToken?: string,
  ): Promise<AccessTokens> {
    const {
      models: { AccessKeys },
    } = this.app;

    const { refreshExpirationMonths, tokenExpiresIn } = auth;
    const accessToken = this.app.jwt.sign(user, { expiresIn: tokenExpiresIn });
    const refreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + refreshExpirationMonths);

    await Promise.all([
      oldRefreshToken && AccessKeys.delete(oldRefreshToken),
      AccessKeys.create({
        refreshToken,
        userId: user.id,
        expiresAt,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}

export default Service;
