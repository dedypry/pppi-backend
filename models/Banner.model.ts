import { HasOne, Table } from 'decorators/objections';
import { Model } from '.';
import { FileModel } from './File.model';

@Table('banners')
export class BannerModel extends Model {
  url!: string;
  is_active!: boolean;

  @HasOne(() => FileModel, {
    from: 'banners.url',
    to: 'files.url',
  })
  file?: FileModel;
}
