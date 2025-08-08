import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

export function sign(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY);
}

export function verify(token) {
  return jwt.verify(token, process.env.SECRET_KEY);
}
