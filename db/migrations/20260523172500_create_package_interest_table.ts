import type { Knex } from 'knex';

const tableName = 'package_interests';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table
      .integer('package_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('packages')
      .onDelete('SET NULL');
    table.string('package_group').notNullable();
    table.string('package_title').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('institution').nullable();
    table.text('note').nullable();
    table.string('status').notNullable().defaultTo('new');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
