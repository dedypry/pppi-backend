import type { Knex } from 'knex';

const tableName = 'schedulers';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.integer('user_id').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('user_id');
  });
}
