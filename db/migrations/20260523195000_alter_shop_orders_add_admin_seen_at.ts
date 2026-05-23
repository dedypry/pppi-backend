import type { Knex } from 'knex';

const tableName = 'shop_orders';
const columnName = 'admin_seen_at';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.timestamp(columnName).nullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn(columnName);
  });
}
