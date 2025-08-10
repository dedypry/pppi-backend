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

export async function generateNia(data: IGenNia) {
  const province = await ProvinceModel.query().findById(data.provinceId);
  const city = await CityModel.query().findById(data.cityId);
  const { max }: any = await UserModel.query().max('sort').first();
  const sortNumber = String(data?.sort || max + 1 || 1).padStart(4, '0');
  const year = data.joinYear || dayjs().format('YY');
  const birtDate = dayjs(data.dateBirth).format('YY');

  const cityCode =
    (city?.code || 0) < 10 ? String(city?.code).padStart(2, '0') : city?.code;

  const provinceCode =
    (province?.code || 0) < 10
      ? String(province?.code).padStart(2, '0')
      : province?.code;

  return {
    nia: `${year}.${provinceCode}.${cityCode}.${birtDate}.${sortNumber}`,
    sort: Number(sortNumber),
    year,
  };
}
