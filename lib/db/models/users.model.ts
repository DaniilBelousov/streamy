import z from 'zod';
import type { Knex } from 'knex';

import { CommonModel } from './common.model.js';

export const UserGuard = z.object({
  id: z.string().uuid(),
  password: z.string(),
  email: z.string().email(),
  nickname: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type IUsers = z.infer<typeof UserGuard>;

interface UserData {
  password: string;
  email: string;
  nickname: string;
}

export class Users extends CommonModel<IUsers, UserData, UserData> {
  constructor(knex: Knex) {
    super(knex, 'users', UserGuard);
  }
}
