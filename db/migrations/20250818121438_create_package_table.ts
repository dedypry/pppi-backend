import type { Knex } from 'knex';

const data = [
  {
    title: 'Peningkatan Kompetensi',
    types: ['Webinar', 'Seminar', 'Workshop', 'Symposium', 'MOOC'],
    children: [
      {
        title: 'Paket 1',
        description: 'Rp.3.500-/peserta + Institutional Fee : 10%',
        benefit: [
          'Promosi di sosmed dan komunitas LPK PPPI',
          'Link Mitigasi Permasalahan Peserta',
          'Team Mitigasi Peserta',
          'Sertifikat Kerjasama Lembaga Kegiatan',
        ],
      },
      {
        title: 'Paket 2',
        description: 'Rp.4.000-/peserta + Institutional Fee : 10%',
        benefit: [
          'Promosi di sosmed dan komunitas LPK PPPI',
          'Link Mitigasi Permasalahan Peserta',
          'Team Mitigasi Peserta',
          'Sertifikat Kerjasama Lembaga Kegiatan',
          'Bumper Kegiatan',
        ],
      },
      {
        title: 'Paket 3',
        description: 'Rp.4.500-/peserta + Institutional Fee : 20%',
        benefit: [
          'Promosi di sosmed dan komunitas LPK PPPI',
          'Link Mitigasi Permasalahan Peserta',
          'Team Mitigasi Peserta',
          'Sertifikat Kerjasama Lembaga Kegiatan',
          'Bumper Kegiatan',
          'Link Pendaftaran peserta',
          'Link Absensi Peserta',
        ],
      },
      {
        title: 'Paket 4',
        description: '20% dari Harga Pendaftaran peserta',
        benefit: [
          'Promosi di sosmed dan komunitas LPK PPPI',
          'Link Mitigasi Permasalahan Peserta',
          'Team Mitigasi Peserta',
          'Sertifikat Kerjasama Lembaga Kegiatan',
        ],
      },
    ],
  },
  {
    title: 'Pelatihan',
    types: [],
    children: [
      {
        title: 'Paket 1',
        description: 'Rp.2000.000/ Kelas',
        benefit: [
          'Promosi di sosmed dan komunitas LPK PPPI',
          'Link Mitigasi Permasalahan Peserta',
          'Team Mitigasi Peserta',
          'Sertifikat Kerjasama Lembaga Kegiatan',
        ],
      },
      {
        title: 'Paket 2',
        description: '20% dari harga pendaftaran peserta',
        benefit: [
          'Promosi di sosmed dan komunitas LPK PPPI',
          'Link Mitigasi Permasalahan Peserta',
          'Team Mitigasi Peserta',
          'Sertifikat Kerjasama Lembaga Kegiatan',
        ],
      },
    ],
  },
];
const tableName = 'packages';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('parent_id').nullable();
    table.string('title');
    table.specificType('types', 'text[]');
    table.specificType('benefit', 'text[]');
    table.text('description');
    table.timestamps(true, true);
  });

  const insertNode = async (node: any, parentId: number | null = null) => {
    const [id] = await knex(tableName)
      .insert({
        title: node.title,
        types: node.types,
        benefit: node.benefit,
        description: node.description,
        parent_id: parentId,
      })
      .returning('id');

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        await insertNode(child, id.id ?? id);
      }
    }
  };

  for (const node of data) {
    await insertNode(node);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
}
