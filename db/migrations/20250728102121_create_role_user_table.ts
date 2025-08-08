import type { Knex } from 'knex';

const tableName = 'role_user';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users');
    table.integer('role_id').references('id').inTable('roles');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
