import { knexInstance } from 'models';
import slugify from 'slugify';

interface IGenerateSlug {
  slug: string;
  table: string;
  key: string;
}

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

export async function createSlugModel({
  slug,
  table,
  key,
}: IGenerateSlug): Promise<string> {
  const sl = Slug(slug);
  const res = await knexInstance.table(table).where(key, sl).first();

  if (res) {
    slug = await createSlugModel({
      slug: `${slug}-${generateRandomString(4)}`,
      table,
      key,
    });
  }

  return slug;
}
