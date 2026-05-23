import type { Knex } from 'knex';

const tableName = 'shop_order_items';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('shop_orders')
      .onDelete('CASCADE');
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('RESTRICT');
    table.string('product_name').notNullable();
    table.decimal('price', 14, 2).notNullable().defaultTo(0);
    table.integer('qty').notNullable().defaultTo(1);
    table.decimal('subtotal', 14, 2).notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
