import type { Knex } from 'knex';

const tableName = 'permissions';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('title').unique()
    table.boolean("core").defaultTo(false);
    table.integer('created_by').references('id').inTable('users')
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
