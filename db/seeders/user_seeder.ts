import type { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = bcrypt.hashSync('12345', 9);
  const existingAdmin = await knex('users')
    .where({ email: adminEmail })
    .first('id');

  let adminUserId: number;

  if (existingAdmin) {
    await knex('users').where({ id: existingAdmin.id }).update({
      password: adminPassword,
    });
    adminUserId = existingAdmin.id;
  } else {
    const [newUser] = await knex('users')
      .insert({
        name: 'admin',
        email: adminEmail,
        password: adminPassword,
      })
      .returning(['id']);

    adminUserId = newUser.id;
  }

  const existingRole = await knex('role_user')
    .where({
      user_id: adminUserId,
      role_id: 1,
    })
    .first();

  if (!existingRole) {
    await knex('role_user').insert({
      user_id: adminUserId,
      role_id: 1,
    });
  }
}
