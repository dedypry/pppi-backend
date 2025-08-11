import { BelongsToOne, Table } from 'decorators/objections';
import { Model } from '.';
import { ProvinceModel } from './Province.model';

@Table('cities')
export class CityModel extends Model {
  name!: string;
  code!: number;
  province_id!: number;

  @BelongsToOne(() => ProvinceModel, {
    from: 'cities.province_id',
    to: 'provinces.id',
  })
  province: ProvinceModel;
}
