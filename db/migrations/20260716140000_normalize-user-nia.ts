import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('users')
    .whereNotNull('nia')
    .where('nia', 'like', '%.%')
    .update({
      nia: knex.raw(`REPLACE(nia, '.', '')`),
    });

  const hasFormResults = await knex.schema.hasTable('form_results');
  if (hasFormResults) {
    await knex('form_results')
      .whereNotNull('nia')
      .where('nia', 'like', '%.%')
      .update({
        nia: knex.raw(`REPLACE(nia, '.', '')`),
      });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Restore dotted format: YY.PP.CC.BB.SSSS (12 digits)
  await knex('users')
    .whereNotNull('nia')
    .whereRaw(`nia !~ '\\.'`)
    .whereRaw(`LENGTH(nia) >= 12`)
    .update({
      nia: knex.raw(`
        CONCAT(
          SUBSTRING(nia FROM 1 FOR 2), '.',
          SUBSTRING(nia FROM 3 FOR 2), '.',
          SUBSTRING(nia FROM 5 FOR 2), '.',
          SUBSTRING(nia FROM 7 FOR 2), '.',
          SUBSTRING(nia FROM 9 FOR 4)
        )
      `),
    });

  const hasFormResults = await knex.schema.hasTable('form_results');
  if (hasFormResults) {
    await knex('form_results')
      .whereNotNull('nia')
      .whereRaw(`nia !~ '\\.'`)
      .whereRaw(`LENGTH(nia) >= 12`)
      .update({
        nia: knex.raw(`
          CONCAT(
            SUBSTRING(nia FROM 1 FOR 2), '.',
            SUBSTRING(nia FROM 3 FOR 2), '.',
            SUBSTRING(nia FROM 5 FOR 2), '.',
            SUBSTRING(nia FROM 7 FOR 2), '.',
            SUBSTRING(nia FROM 9 FOR 4)
          )
        `),
      });
  }
}
