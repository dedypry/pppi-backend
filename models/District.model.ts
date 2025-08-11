import { BelongsToOne, Table } from 'decorators/objections';
import { Model } from '.';
import { CityModel } from './Citie.model';

@Table('districts')
export class DistrictModel extends Model {
  name!: string;
  code?: number;
  city_id!: number;

  @BelongsToOne(() => CityModel, {
    from: 'districts.city_id',
    to: 'cities.id',
  })
  city: CityModel;
}
