import type { Knex } from 'knex';

const tableName = 'products';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table
      .integer('category_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('product_categories')
      .onDelete('SET NULL');
    table
      .integer('subcategory_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('product_categories')
      .onDelete('SET NULL');
    table
      .integer('showcase_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('product_showcases')
      .onDelete('SET NULL');
    table
      .integer('uom_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('uoms')
      .onDelete('SET NULL');
    table.string('rack_location').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('category_id');
    table.dropColumn('subcategory_id');
    table.dropColumn('showcase_id');
    table.dropColumn('uom_id');
    table.dropColumn('rack_location');
  });
}
