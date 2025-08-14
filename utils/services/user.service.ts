import { ForbiddenException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CityModel } from 'models/Citie.model';
import { ProvinceModel } from 'models/Province.model';
import { UserModel } from 'models/User.model';

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
  const { max }: any = await UserModel.query().max('nia').first();
  const split = max.split('.');
  const sortNumber = Number(split[split.length - 1]) + 1;

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
  let nia = `${data.year}.${data.provinceCode}.${data.cityCode}.${data.birtDate}.${sortNumber}`;

  const checkNia = await UserModel.query().findOne('nia', nia);

  if (checkNia) {
    nia = await generateSimpleNia({
      ...data,
      sortNumber: Number(data.sortNumber) + 1,
    });
  }

  return nia;
}
