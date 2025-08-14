import { Injectable, NotFoundException } from '@nestjs/common';
import { CityModel } from 'models/Citie.model';
import { DistrictModel } from 'models/District.model';
import { ProvinceModel } from 'models/Province.model';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { UpdateProvinceCodeDto } from './dto/update.dto';
import { raw } from 'objection';

@Injectable()
export class AreaService {
  async getProvince(query: PaginationDto) {
    const province = ProvinceModel.query()
      .orderBy('name', 'asc')
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('name', `%${query.q}%`)
            .orWhereILike('code', `%${query.q}%`);
        }
      });

    if (query?.page) {
      return await province.page(query.page - 1, query.pageSize);
    }

    return await province;
  }

  async getAllCity(query: PaginationDto) {
    const city = CityModel.query()
      .orderBy('name', 'asc')
      .withGraphFetched('province')
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('name', `%${query.q}%`)
            .orWhereILike('code', `%${query.q}%`)
            .orWhereExists(
              CityModel.relatedQuery('province').whereILike(
                'province.name',
                `%${query.q}%`,
              ),
            );
        }
      });
    if (query?.page) {
      return await city.page(query.page - 1, query.pageSize);
    }

    return await city;
  }

  async getCity(provinceId: number) {
    return await CityModel.query().where('province_id', provinceId);
  }

  async updateCodeCity(body: UpdateProvinceCodeDto, id: number) {
    const city = await CityModel.query().findById(id);

    if (!city) throw new NotFoundException();

    await city.$query().update({
      code: body.code as any,
    });

    return 'Kode berhasil diupdate';
  }

  async getAllDistricMerge() {
    const district = await DistrictModel.query()
      .select(
        'districts.id',
        raw(
          `districts.name || ' | ' || city.name || ' | ' || province.name`,
        ).as('name'),
      )
      .join('cities as city', 'city.id', 'districts.city_id')
      .join('provinces as province', 'province.id', 'city.province_id');

    return district;
  }

  async getAllDistrict(query: PaginationDto) {
    const district = DistrictModel.query()
      .orderBy('name', 'asc')
      .withGraphFetched('city.province')
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('name', `%${query.q}%`)
            .orWhereILike('code', `%${query.q}%`)
            .orWhereExists(
              DistrictModel.relatedQuery('city').whereILike(
                'city.name',
                `%${query.q}%`,
              ),
            )
            .orWhereExists(
              DistrictModel.relatedQuery('city')
                .joinRelated('province')
                .whereILike('province.name', `%${query.q}%`),
            );
        }
      });
    if (query?.page) {
      return await district.page(query.page - 1, query.pageSize);
    }

    return await district;
  }

  async updateCodeDistrict(body: UpdateProvinceCodeDto, id: number) {
    const district = await DistrictModel.query().findById(id);

    if (!district) throw new NotFoundException();

    await district.$query().update({
      code: body.code as any,
    });

    return 'Kode berhasil diupdate';
  }

  async getDistrict(cityId: number) {
    return await DistrictModel.query().where('city_id', cityId);
  }

  async updateProvinceCode(body: UpdateProvinceCodeDto, id: number) {
    const province = await ProvinceModel.query().findById(id);

    if (!province) throw new NotFoundException();

    await province.$query().update({
      code: body.code as any,
    });

    return 'Kode berhasil diupdate';
  }
}
