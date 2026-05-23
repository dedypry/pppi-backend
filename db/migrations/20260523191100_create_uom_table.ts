import type { Knex } from 'knex';

const tableName = 'uoms';

const seedData = [
  { name: 'Piece', code: 'pcs', description: 'Satuan per item' },
  { name: 'Pack', code: 'pack', description: 'Satuan per kemasan pack' },
  { name: 'Box', code: 'box', description: 'Satuan per kotak' },
  { name: 'Botol', code: 'btl', description: 'Satuan botol' },
  { name: 'Lembar', code: 'lbr', description: 'Satuan lembar' },
];

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('code').notNullable().unique();
    table.text('description').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  await knex(tableName).insert(seedData);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
