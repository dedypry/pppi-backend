import type { Knex } from 'knex';

const tableName = 'schedulers';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.decimal('price', 18, 2).defaultTo(0);
    table.decimal('discount', 18, 2).defaultTo(0);
    table.boolean('is_show_web').defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('price');
    table.dropColumn('discount');
    table.dropColumn('is_show_web');
  });
}
