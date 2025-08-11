import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE users ALTER COLUMN sort DROP DEFAULT`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE users ALTER COLUMN sort SET DEFAULT nextval('users_sort_seq')`,
  );
}
