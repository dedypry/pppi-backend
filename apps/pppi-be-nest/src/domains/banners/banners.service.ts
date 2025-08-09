/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable, NotFoundException } from '@nestjs/common';
import BannerCreateDto, {
  BannerDeleteDto,
  BannerUpdateStatusDto,
} from './dto/create.dto';
import { BannerModel } from 'models/Banner.model';
import {
  destroyFile,
  setFileParent,
} from 'utils/services/file-gallery.service';

@Injectable()
export class BannersService {
  async list() {
    const banners = await BannerModel.query()
      .withGraphFetched('file')
      .orderBy('id', 'DESC');

    return banners;
  }

  async create(body: BannerCreateDto) {
    const banners = await BannerModel.query().insert(
      body.urls.map((e) => ({
        url: e,
        is_active: true,
      })),
    );

    for (const item of banners) {
      setFileParent(item.url, item);
    }

    return 'Banner benrhasil di simpan';
  }

  async updateStatus(id: number, body: BannerUpdateStatusDto) {
    const banner = await BannerModel.query().findById(id);

    if (!banner) throw new NotFoundException();

    console.log('B', body);

    await banner.$query().update({
      is_active: body?.status,
    });

    return 'Status banner berhasil di update';
  }

  async destroy(body: BannerDeleteDto) {
    const banners = await BannerModel.query().whereIn('id', body.ids);
    const urls: string[] = [];
    for (const banner of banners) {
      urls.push(banner.url);
      await banner.$query().delete();
    }

    console.log('URL', urls);
    destroyFile({ urls });

    return 'Banner berhasil di hapus';
  }
}
