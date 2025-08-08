import { Injectable } from '@nestjs/common';
import { CityModel } from 'models/Citie.model';
import { DistrictModel } from 'models/District.model';
import { ProvinceModel } from 'models/Province.model';

@Injectable()
export class AreaService {
  async getProvince() {
    return await ProvinceModel.query();
  }

  async getCity(provinceId: number) {
    return await CityModel.query().where('province_id', provinceId);
  }

  async getDistrict(cityId: number) {
    return await DistrictModel.query().where('city_id', cityId);
  }
}
