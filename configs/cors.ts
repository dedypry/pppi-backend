import 'dotenv/config';
const production = process.env.NODE_ENV === 'production';

export const cors = !production
  ? '*'
  : ['https://dpn-pppi.org', 'https://admin.dpn-pppi.org'];
