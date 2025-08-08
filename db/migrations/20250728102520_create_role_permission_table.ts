import type { Knex } from 'knex';

const tableName = 'role_permission';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('role_id').references('id').inTable('roles')
    table.integer('permission_id').references('id').inTable('permissions')
    table.boolean("read").defaultTo(false);
    table.boolean("update").defaultTo(false);
    table.boolean("create").defaultTo(false);
    table.boolean("delete").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
