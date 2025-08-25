import type { Knex } from 'knex';

const tableName = 'form_headers';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('form_id').references('id').inTable('forms');
    table.string('key');
    table.string('title');
    table.string('type');
    table.jsonb('options');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
