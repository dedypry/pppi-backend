import type { Knex } from 'knex';

const tableName = 'setting_apps';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('key');
    table.jsonb('value');
    table.timestamps(true, true);
  });

  await knex(tableName).insert({
    key: 'apps',
    value: {
      logo: '/logo.png',
      title: 'Perkumpulan Perawat Pembaharuan Indonesia',
      short_title: 'PPPI',
      telp_1: '+62 852 1048 6321',
      telp_2: '+62 812 8872 8320',
      email: 'dpn.p3i@gmail.com',
      address: 'Jl. Bekasi Timur IX No. 17/05 Jatinegara – Jakarta Timur 13350',
    },
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
