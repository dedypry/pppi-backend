import type { Knex } from 'knex';

const tableName = 'schedulers';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('cover');
    table.string('title');
    table.string('color').defaultTo('green');
    table.string('slug').unique();
    table.string('subtitle').nullable();
    table.dateTime('start_at');
    table.dateTime('end_at').nullable();
    table.text('description').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
