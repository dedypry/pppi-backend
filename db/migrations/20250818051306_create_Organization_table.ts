import type { Knex } from 'knex';

const data = [
  {
    title: 'DEWAN PENGAWAS',
  },
  {
    title: 'KETUA UMUM',
    children: [
      {
        title: 'SEKERTARIS JENDRAL',
        children: [
          {
            title: 'WASEKJEN I',
          },
          {
            title: 'WASEKJEN 2',
          },
          {
            title: '',
            children: [
              {
                title: 'BIRO ORGANISANSI DAN KEANGGOTAAN',
              },
              {
                title: 'BIRO PELATIHAN DAN PENINGKATAN KOMPETENSI PROFESI',
              },
              {
                title: 'BIRO PENELITIAN, PENGEMBANGAN DAN PUBLIKASI ILMIAH',
              },
              {
                title: 'BIRO ADVOKASI DAN HUKUM',
              },
              {
                title: 'BIRO KOMUNIKASI, INFORMASI DAN KEBIJAKAN PUBLIK',
              },
              {
                title: 'BIRO KESEJAHTERAAN, USAHA DAN KEMANDIRIAN ORGANISASI',
              },
              {
                title:
                  'BIRO KEMAHASISWAAN KEPERAWATAN DAN PEMBINAAN PERAWAT PEMUDA',
              },
              {
                title:
                  'BIRO KEMITRAAN, HUBUNGAN ANTAR LEMBAGA DAN PEMBERDAYAAN MASYARAKAT',
              },
            ],
          },
          {
            title: 'BENDAHARA UMUM',
            children: [
              {
                title: 'WABENDUM',
              },
            ],
          },
        ],
      },
      {
        title: 'DIREKTUR LPK PPPI',
      },
    ],
  },
  {
    title: 'DEWAN KEHORMATAN',
  },
];

const tableName = 'organizations';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('user_id').nullable().references('id').inTable('users');
    table.integer('parent_id');
    table.string('title');
    table.text('description').nullable();
    table.timestamps(true, true);
  });

  const insertNode = async (node: any, parentId: number | null = null) => {
    const [id] = await knex(tableName)
      .insert({ title: node.title, parent_id: parentId })
      .returning('id');

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        await insertNode(child, id.id ?? id); // PostgreSQL return bisa {id: X} atau langsung X tergantung versi
      }
    }
  };

  // Insert root data
  for (const node of data) {
    await insertNode(node);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
