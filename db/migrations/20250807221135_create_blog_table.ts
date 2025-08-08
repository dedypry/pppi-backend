import type { Knex } from 'knex';

const tableName = 'blogs';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blog_categories', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('icon').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('category_id').references('id').inTable('blog_categories');
    table.integer('writer_id').references('id').inTable('users');
    table.string('cover').nullable();
    table.string('title');
    table.string('slug').unique();
    table.string('subtitle');
    table.text('content');
    table.specificType('tags', 'text[]');
    table.string('status');
    table.integer('view_count').defaultTo(0);
    table.integer('share_count').defaultTo(0);
    table.dateTime('publish_at').nullable();
    table.dateTime('schedule').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('blog_comments', (table) => {
    table.increments('id').primary();
    table.integer('parent_id');
    table.integer('blog_id').references('id').inTable('blogs');
    table.integer('user_id').nullable().references('id').inTable('users');
    table.text('content');
    table.string('name').nullable();
    table.string('email').nullable();
    table.string('website').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableName);
  await knex.schema.dropTableIfExists('blog_comments');
  await knex.schema.dropTableIfExists('blog_categories');
}
