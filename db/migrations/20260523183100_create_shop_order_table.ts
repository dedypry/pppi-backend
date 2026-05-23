import type { Knex } from 'knex';

const tableName = 'shop_orders';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('order_code').notNullable().unique();
    table.string('customer_name').notNullable();
    table.string('customer_email').notNullable();
    table.string('customer_phone').notNullable();
    table.text('shipping_address').notNullable();
    table.text('note').nullable();
    table.decimal('total_amount', 14, 2).notNullable().defaultTo(0);
    table.string('status').notNullable().defaultTo('pending');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
