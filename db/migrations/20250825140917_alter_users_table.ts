import type { Knex } from 'knex';

const tableName = 'users';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.string('token');
    table.dateTime('token_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('token');
    table.dropColumn('token_at');
  });
}
