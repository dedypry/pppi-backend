import type { Knex } from 'knex';

const tableName = 'personal_token';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.text('token')
    table.integer('user_id').references('id').inTable('users')
    table.dateTime('exp')
    table.string('ip').nullable()
    table.string('browser').nullable()
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable()
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
