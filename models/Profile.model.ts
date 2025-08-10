import { BelongsToOne, Table } from 'decorators/objections';
import { Model } from '.';
import { ProvinceModel } from './Province.model';
import { CityModel } from './Citie.model';
import { DistrictModel } from './District.model';

@Table('profiles')
export class ProfileModel extends Model {
  user_id?: number;
  nik?: string;
  place_birth?: string;
  date_birth?: string;
  gender?: string;
  citizenship?: string;
  address?: string;
  province_id?: number;
  city_id?: number;
  district_id?: number;
  phone?: string;
  last_education_nursing?: string;
  last_education?: string;
  workplace?: string;
  hope_in?: string;
  contribution?: string;
  is_member_payment?: boolean;
  member_payment_file?: string;
  reason_reject?: string;
  photo?: string;

  @BelongsToOne(() => ProvinceModel, {
    from: 'profiles.province_id',
    to: 'provinces.id',
  })
  province: ProvinceModel;

  @BelongsToOne(() => CityModel, {
    from: 'profiles.city_id',
    to: 'cities.id',
  })
  city: CityModel;

  @BelongsToOne(() => DistrictModel, {
    from: 'profiles.district_id',
    to: 'districts.id',
  })
  district: DistrictModel;
}
