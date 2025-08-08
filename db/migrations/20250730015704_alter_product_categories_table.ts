import type { Knex } from 'knex';

const tableName = "product_categories";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.string('image').nullable()
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table)=> {
    table.dropColumn("icon");
  })
}
