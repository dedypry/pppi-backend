import type { Knex } from 'knex';

const tableName = 'products';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('image').nullable();
    table.string('unit').nullable();
    table.decimal('price', 14, 2).notNullable().defaultTo(0);
    table.integer('stock').notNullable().defaultTo(0);
    table.text('description').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
