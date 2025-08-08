import type { Knex } from 'knex';

const tableName = 'files';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.string('mime_type')
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table)=> {
     table.dropColumn("mime_type");
  })
}
