import { randomUUID } from 'node:crypto';

import type z from 'zod';
import type { FastifyInstance } from 'fastify';
import type { UserType } from '@fastify/jwt';

import { validatePassword, hashPassword } from '../../lib/utils.js';
import type schemas from './auth.schema.js';
import type { IUser } from '../../lib/db/index.js';

type SignUpBody = z.infer<typeof schemas.signUp.body>;
type SignInBody = z.infer<typeof schemas.signIn.body>;
type RefreshBody = z.infer<typeof schemas.refresh.body>;

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
      models: { Users, AccessKeys },
    } = this.app;
    const { password, email } = data;
    const user = await Users.read().select('*').where({ email }).first();
    if (user) throw new Error('User already exists');
    const passwordHash = await hashPassword(password);
    const id = await Users.create({ ...data, password: passwordHash });
    const tokens = this.issueTokens({ id, nickname: data.nickname });
    const expiresAt = this.getExpirationDate();
    await AccessKeys.create({ refreshToken: tokens.refreshToken, userId: id, expiresAt });
    return tokens;
  }

  async signIn({ password, email }: SignInBody): Promise<AccessTokens> {
    const {
      models: { Users, AccessKeys },
    } = this.app;
    const user = await Users.read().select('*').where({ email }).first();
    if (!user) throw new Error('User not found');
    const isValid = await validatePassword(password, user.password);
    if (!isValid) throw new Error('Invalid password');
    const tokens = this.issueTokens(user);
    const expiresAt = this.getExpirationDate();
    await AccessKeys.create({
      refreshToken: tokens.refreshToken,
      userId: user.id,
      expiresAt,
    });
    return tokens;
  }

  async refresh(data: RefreshBody) {
    const {
      models: { AccessKeys, Users },
    } = this.app;
    const row = await AccessKeys.read()
      .select('*')
      .where({ refreshToken: data.refreshToken })
      .innerJoin<IUser>(
        'users',
        `${AccessKeys.tableName}.userId`,
        `${Users.tableName}.id`,
      )
      .first();
    if (!row) throw Error('Unauthorized');
    const { id, nickname } = row;
    const tokens = this.issueTokens({ id, nickname });
    AccessKeys.delete(data.refreshToken);
    return tokens;
  }

  private issueTokens(user: UserType): AccessTokens {
    const accessToken = this.app.jwt.sign(user);
    const refreshToken = randomUUID();
    return { accessToken, refreshToken };
  }

  private getExpirationDate(): Date {
    const TOKEN_EXPIRATION_MONTHS = 6;
    const date = new Date();
    date.setMonth(date.getMonth() + TOKEN_EXPIRATION_MONTHS);
    return date;
  }
}

export default Service;
