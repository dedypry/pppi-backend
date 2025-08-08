import type { Knex } from 'knex';

const tableName = "product_categories";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('parent_id').nullable()
    table.integer('user_id').references('id').inTable('users')
    table.string('name')
    table.text('description').nullable()
    table.enum('status',['active','non active','draft']).defaultTo('active')
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
