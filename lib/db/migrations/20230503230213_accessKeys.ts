import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accessKeys', table => {
    table.uuid('refreshToken').primary();
    table.uuid('userId');
    table.foreign('userId').references('id').inTable('users');
    table
      .timestamp('expiresAt', { precision: 6 })
      .defaultTo(knex.fn.now(6))
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('accessKeys');
}
