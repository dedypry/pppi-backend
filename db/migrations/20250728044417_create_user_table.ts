import type { Knex } from 'knex';

const tableName = 'users';
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'users_sort_seq') THEN
      CREATE SEQUENCE users_sort_seq START 1;
    END IF;
  END;
  $$;
`);

  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('parent_id');
    table.integer('sort').defaultTo(knex.raw(`nextval('users_sort_seq')`));
    table.string('join_year', 5).nullable();
    table.string('front_title', 50).nullable();
    table.string('name');
    table.string('back_title', 50).nullable();
    table.string('nia', 20).nullable().unique();
    table.string('job_title').nullable();
    table.string('email').unique().notNullable();
    table.string('password');
    table.dateTime('email_verified_at').nullable();
    table.dateTime('last_login').nullable().defaultTo(knex.fn.now());
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_organization').defaultTo(false);
    table.string('status', 10).nullable();
    table.dateTime('approved_at').nullable();
    table.integer('approved_by').nullable();
    table.dateTime('rejected_at').nullable();
    table.integer('rejected_by').nullable();
    table.string('rejected_note').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
  await knex.raw('DROP SEQUENCE IF EXISTS users_sort_seq');
}
