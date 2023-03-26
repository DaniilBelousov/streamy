import { randomUUID } from 'node:crypto';

import type { Knex } from 'knex';
import type z from 'zod';

class CommonModel<RData extends {}, CData, UData extends Partial<CData>> {
  public tableName: string;
  private knex: Knex;
  private guard: z.AnyZodObject;

  constructor(knex: Knex, tableName: string, guard: z.AnyZodObject) {
    this.knex = knex;
    this.tableName = tableName;
    this.guard = guard;
  }

  async create(data: CData): Promise<string> {
    const parsedData = this.guard.safeParse(data);
    const isValid = parsedData.success;
    if (!isValid) throw new Error();
    const id = randomUUID();
    const model = this.knex(this.tableName);
    await model.insert(data);
    return id;
  }

  async update(id: string, data: UData): Promise<string> {
    const parsedData = this.guard.partial().safeParse(data);
    const isValid = parsedData.success;
    if (!isValid) throw new Error();
    const model = this.knex(this.tableName);
    await model.where({ id }).update(data);
    return id;
  }

  async delete(id: string): Promise<string> {
    const model = this.knex(this.tableName);
    await model.where({ id }).del();
    return id;
  }

  read<T>(): Knex.QueryBuilder<RData, T> {
    const model = this.knex<RData, T>(this.tableName);
    return model;
  }
}

export { CommonModel };
