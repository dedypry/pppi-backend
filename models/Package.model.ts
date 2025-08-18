import { HasMany, Modifier, Table } from 'decorators/objections';
import { Model } from '.';
import { AnyQueryBuilder } from 'objection';

@Table('packages')
export class PackageModel extends Model {
  parent_id: number;
  title: string;
  types: string[];
  benefit: string[];
  description: string;

  @Modifier
  child(query: AnyQueryBuilder) {
    query.withGraphFetched('children(child)').orderBy('title', 'asc');
  }

  @HasMany(() => PackageModel, {
    from: 'packages.id',
    to: 'packages.parent_id',
  })
  children: PackageModel[];
}
