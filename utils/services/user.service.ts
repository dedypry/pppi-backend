import { ForbiddenException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CityModel } from 'models/Citie.model';
import { ProvinceModel } from 'models/Province.model';
import { UserModel } from 'models/User.model';
import { raw } from 'objection';

interface IGenNia {
  provinceId: number;
  cityId: number;
  joinYear?: number;
  sort?: number;
  dateBirth: string;
}

interface IGenNiaSimple {
  year: string | number;
  provinceCode: string | number | undefined;
  cityCode: string | number | undefined;
  birtDate: string | number;
  sortNumber: string | number;
}

export async function generateNia(data: IGenNia) {
  if (!data.provinceId || !data.cityId) {
    throw new ForbiddenException('Isi Provinsi dan kota terlebih dahulu');
  }
  const province = await ProvinceModel.query().findById(data.provinceId);
  const city = await CityModel.query().findById(data.cityId);
  const { max }: any = await UserModel.query()
    .max(
      raw(
        "CAST(NULLIF(RIGHT(REPLACE(COALESCE(nia, ''), '.', ''), 4), '') AS INTEGER)",
      ),
    )
    .first();

  const sortNumber = (max || 0) + 1;

  const year = data.joinYear || dayjs().format('YY');
  const birtDate = dayjs(data.dateBirth).format('YY');

  const cityCode =
    (city?.code || 0) < 10 ? String(city?.code).padStart(2, '0') : city?.code;

  const provinceCode =
    (province?.code || 0) < 10
      ? String(province?.code).padStart(2, '0')
      : province?.code;

  const nia = await generateSimpleNia({
    year,
    provinceCode,
    cityCode,
    birtDate,
    sortNumber,
  });

  return {
    nia,
    sort: Number(sortNumber),
    year,
  };
}

async function generateSimpleNia(data: IGenNiaSimple) {
  const sortNumber = String(data.sortNumber).padStart(4, '0');
  // Stored without dots: YYPPCCBBSSSS (display: YY.PP.CC.BB.SSSS)
  let nia = `${data.year}${data.provinceCode}${data.cityCode}${data.birtDate}${sortNumber}`;

  const checkNia = await UserModel.query().findOne('nia', nia);

  if (checkNia) {
    nia = await generateSimpleNia({
      ...data,
      sortNumber: Number(data.sortNumber) + 1,
    });
  }

  return nia;
}

/** Format stored NIA (261616260190) for display (26.16.16.26.0190). */
export function formatNia(nia?: string | null): string {
  if (nia === null || nia === undefined || nia === '') return '';
  const raw = String(nia).replace(/\./g, '').trim();
  if (!raw) return '';
  if (raw.length >= 12) {
    return `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}.${raw.slice(8, 12)}`;
  }
  if (raw.length >= 10) {
    return `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4, 6)}.${raw.slice(6)}`;
  }
  if (String(nia).includes('.')) return String(nia).trim();
  return raw;
}

/** Normalize NIA input to storage form (no dots). */
export function normalizeNia(nia?: string | null): string {
  if (!nia) return '';
  return String(nia).replace(/\./g, '').trim();
}
