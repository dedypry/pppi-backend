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

export function parseTempatTanggal(str: string) {
  if (!str) return { tempat: null, tanggal: null };

  try {
    // Hilangkan spasi berlebih di awal/akhir
    str = str.trim();

    // Pecah berdasarkan koma ATAU spasi sebelum angka
    let tempat = '';
    let tanggal = '';

    // ✅ Cek format dengan slash: "Tempat/Tanggal"
    if (str.includes('/')) {
      const parts = str.split('/');
      tempat = parts[0].trim();
      tanggal = parts[1]?.trim() || '';
    } else if (str.includes(',')) {
      const parts = str.split(',');
      tempat = parts[0].trim();
      tanggal = parts.slice(1).join(',').trim();
    } else {
      // Cari posisi angka pertama (awal tanggal)
      const match = str.match(/\d/);
      if (match) {
        const index = match.index;
        tempat = str.slice(0, index).trim();
        tanggal = str.slice(index).trim();
      }
    }

    return { tempat, tanggal };
  } catch (error) {
    console.log(error);
    return {
      tempat: str,
      tanggal: str,
    };
  }
}
