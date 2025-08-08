import * as bcrypt from 'bcrypt';

export function hashPassword(password): string {
  return bcrypt.hashSync(password, 9);
}

export function comparePassword(password, encrypted): boolean {
  return bcrypt.compareSync(password, encrypted);
}
