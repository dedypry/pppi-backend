import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingAppModel } from 'models/SettingApp.model';
import { AppsUpdateDto } from './dto/apps.dto';

@Injectable()
export class AppsService {
  async list(key: string) {
    const result = await SettingAppModel.query().findOne('key', key);

    return result?.value;
  }

  async updateData(data: AppsUpdateDto, key: string) {
    const apps = await SettingAppModel.query().findOne('key', key);

    if (!apps) throw new NotFoundException();

    await apps.$query().update({
      value: {
        ...apps.value,
        ...data,
      },
    });

    return 'Data berhasil di ubah';
  }
}
