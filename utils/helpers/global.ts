import slugify from 'slugify';

export function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

export function Slug(slug: string) {
  return slugify(slug, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });
}
