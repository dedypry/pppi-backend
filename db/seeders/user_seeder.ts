import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  const users = await knex('users')
    .insert([
      {
        name: 'admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('12345', 9),
      },
    ])
    .returning(['id']);

  await knex('role_user').insert(
    users.map((e: any) => ({
      user_id: e.id,
      role_id: 1,
    })),
  );
}
