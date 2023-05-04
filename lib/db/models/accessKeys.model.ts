import z from 'zod';
import type { Knex } from 'knex';

import { CommonModel } from './common.model.js';

export const AccessKeysGuard = z.object({
  refreshToken: z.string().uuid(),
  userId: z.string(),
  expiresAt: z.date(),
});

export type IAccessKeys = z.infer<typeof AccessKeysGuard>;

export class AccessKeys extends CommonModel<IAccessKeys, IAccessKeys, IAccessKeys> {
  constructor(knex: Knex) {
    super(knex, 'accessKeys', AccessKeysGuard);
  }

  override async create(data: IAccessKeys): Promise<string> {
    const parsedData = this.guard.safeParse(data);
    const isValid = parsedData.success;
    if (!isValid) throw new Error();
    const model = this.knex(this.tableName);
    await model.insert(data);
    return data.refreshToken;
  }
}
