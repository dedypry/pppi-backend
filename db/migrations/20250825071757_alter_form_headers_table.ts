import type { Knex } from 'knex';

const tableName = 'form_headers';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.boolean('required').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('required');
  });
}
