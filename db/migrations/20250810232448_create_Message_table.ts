import type { Knex } from 'knex';

const tableName = 'messages';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('subject');
    table.text('content');
    table.boolean('is_read').defaultTo(false);
    table.specificType('read_by', 'integer[]');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
