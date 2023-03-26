import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('password').notNullable();
    table.string('email').notNullable();
    table.string('nickname').notNullable();
    table
      .timestamp('createdAt', { precision: 6 })
      .defaultTo(knex.fn.now(6))
      .notNullable();
    table
      .timestamp('updatedAt', { precision: 6 })
      .defaultTo(knex.fn.now(6))
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
