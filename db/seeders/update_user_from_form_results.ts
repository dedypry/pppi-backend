import type { Knex } from 'knex';
import { readFileSync } from 'fs';
import { join } from 'path';

type FormResultItem = {
  user?: { id?: number };
  value?: {
    jabatan?: string;
    wilayah?: string;
    pengurus?: string;
  };
};

/**
 * Update users from Munas form_results:
 * - job_title = jabatan
 * - region = wilayah
 * - administrator_role = pengurus
 */
export async function seed(knex: Knex): Promise<void> {
  const filePath = join(process.cwd(), 'db/json/user.json');
  const raw = JSON.parse(readFileSync(filePath, 'utf8')) as {
    form_results?: FormResultItem[];
  };

  const results = raw.form_results || [];
  let updated = 0;
  let skipped = 0;

  for (const item of results) {
    const userId = item.user?.id;
    if (!userId) {
      skipped += 1;
      continue;
    }

    const jabatan = item.value?.jabatan?.trim() || null;
    const wilayah = item.value?.wilayah?.trim() || null;
    const pengurus = item.value?.pengurus?.trim() || null;

    // Keep job_title compatible with multi-title JSON storage in admin
    const jobTitle = jabatan ? JSON.stringify([jabatan]) : null;

    const affected = await knex('users').where({ id: userId }).update({
      job_title: jobTitle,
      region: wilayah,
      administrator_role: pengurus,
      updated_at: knex.fn.now(),
    });

    if (affected) {
      updated += 1;
    } else {
      skipped += 1;
      console.warn(`User id ${userId} not found, skipped`);
    }
  }

  console.log(
    `update_user_from_form_results: updated=${updated}, skipped=${skipped}, total=${results.length}`,
  );
}
