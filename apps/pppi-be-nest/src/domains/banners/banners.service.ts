import { Injectable } from '@nestjs/common';
import BannerCreateDto from './dto/create.dto';
import { BannerModel } from 'models/Banner.model';
import { FileModel } from 'models/File.model';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Injectable()
export class BannersService {
  async list(query: PaginationDto) {
    const banners = await BannerModel.query().page(query.page, query.pageSize);

    return banners;
  }

  async create(body: BannerCreateDto) {
    const banner = await BannerModel.query().insert({
      url: body.url,
      is_active: true,
    });

    const file = await FileModel.query().findOne('url', banner.url);

    if (file) {
      await file.$query().update({
        parent_id: banner.id,
      });
    }

    return 'Banner benrhasil di simpan';
  }
}
