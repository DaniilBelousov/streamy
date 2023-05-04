import z from 'zod';
import type { Knex } from 'knex';

import { CommonModel } from './common.model.js';

export const UserGuard = z.object({
  password: z.string(),
  email: z.string().email(),
  nickname: z.string(),
});

type UserData = z.infer<typeof UserGuard>;

export interface IUser {
  id: string;
  password: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export class Users extends CommonModel<IUser, UserData, UserData> {
  constructor(knex: Knex) {
    super(knex, 'users', UserGuard);
  }
}
