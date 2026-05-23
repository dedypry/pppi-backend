import { BelongsToOne, Table } from 'decorators/objections';
import { Model } from '.';
import { PackageModel } from './Package.model';

@Table('package_interests')
export class PackageInterestModel extends Model {
  package_id: number | null;
  package_group: string;
  package_title: string;
  name: string;
  email: string;
  phone: string;
  institution: string | null;
  note: string | null;
  status: 'new' | 'follow_up' | 'closed';

  @BelongsToOne(() => PackageModel, {
    from: 'package_interests.package_id',
    to: 'packages.id',
  })
  package: PackageModel;
}
