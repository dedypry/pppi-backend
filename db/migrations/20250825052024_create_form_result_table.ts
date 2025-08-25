import type { Knex } from 'knex';

const tableName = 'form_results';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('form_id').references('id').inTable('forms');
    table.string('nia');
    table.string('name');
    table.string('email');
    table.jsonb('value');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
