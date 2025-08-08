import type { Knex } from 'knex';

const tableName = 'roles';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('title');
    table.string('slug').unique();
    table.text('description').nullable();
    table.timestamps(true, true);
  });

  await knex.table('roles').insert([
    {
      title: 'super-admin',
      slug: 'super-admin',
      description:
        'Memiliki akses penuh ke seluruh sistem, termasuk pengelolaan pengguna, data, dan pengaturan aplikasi.',
    },
    {
      title: 'admin',
      slug: 'admin',
      description:
        'Bertanggung jawab atas pengelolaan operasional sistem, termasuk manajemen konten dan pengguna biasa.',
    },
    {
      title: 'staff',
      slug: 'staff',
      description:
        'Pengguna internal yang membantu tugas administratif atau operasional terbatas sesuai hak akses yang diberikan.',
    },
    {
      title: 'member',
      slug: 'member',
      description:
        'Pengguna akhir sistem yang memiliki akses dasar untuk menggunakan fitur-fitur umum aplikasi.',
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
