import { Model, ModelClass } from 'objection';
const tableMetadataKey = Symbol('tableName');
import * as pluralize from 'pluralize';

const relationMetadataKey = Symbol('relations');
const modifierMetadataKey = Symbol('modifiers');

export type RelationType = 'HasOne' | 'HasMany' | 'BelongsToOne' | 'ManyToMany';
interface IJoin {
  from: string;
  to: string;
  through?: {
    from: string;
    to: string;
    extra?: string[];
  };
}
interface RelationMeta {
  property: string;
  relatedModel: () => ModelClass<any>;
  relation: RelationType;
  join: IJoin;
}

export function Table(name?: string) {
  return function (target: any) {
    let tableName = name
      ? name
      : target.name
          .replace(/Model$/, '')
          .replace(/[A-Z]/g, (char, index) =>
            index === 0 ? char.toLowerCase() : `_${char.toLowerCase()}`,
          );

    if (!name) {
      tableName = pluralize.isPlural(tableName)
        ? tableName
        : pluralize.plural(tableName);
    }

    Reflect.defineMetadata(tableMetadataKey, tableName, target);

    Object.defineProperty(target, 'tableName', {
      get: () => Reflect.getMetadata(tableMetadataKey, target),
    });

    Object.defineProperty(target, 'modifiers', {
      get: function () {
        return Reflect.getMetadata(modifierMetadataKey, target) || {};
      },
    });

    Object.defineProperty(target, 'relationMappings', {
      get: function () {
        const relations =
          Reflect.getMetadata(relationMetadataKey, target) || {};

        const mappings: any = {};
        for (const [key, value] of Object.entries(relations)) {
          let relation: any = null;

          switch ((value as RelationMeta).relation) {
            case 'BelongsToOne':
              relation = Model.BelongsToOneRelation;
              break;
            case 'HasMany':
              relation = Model.HasManyRelation;
              break;
            case 'HasOne':
              relation = Model.HasOneRelation;
              break;
            case 'ManyToMany':
              relation = Model.ManyToManyRelation;
              break;

            default:
              break;
          }

          mappings[key] = {
            relation,
            modelClass: (value as any).modelClass,
            join: (value as any).join,
          };
        }
        return mappings;
      },
    });
  };
}

export function HasMany(modelClass: () => any, join: IJoin) {
  return function (target: any, propertyKey: string) {
    const relations =
      Reflect.getMetadata(relationMetadataKey, target.constructor) || {};

    relations[propertyKey] = {
      relation: 'HasMany',
      modelClass,
      join,
    };

    Reflect.defineMetadata(relationMetadataKey, relations, target.constructor);
  };
}
export function BelongsToOne(modelClass: () => any, join: IJoin) {
  return function (target: any, propertyKey: string) {
    const relations =
      Reflect.getMetadata(relationMetadataKey, target.constructor) || {};

    relations[propertyKey] = {
      relation: 'BelongsToOne',
      modelClass,
      join,
    };

    Reflect.defineMetadata(relationMetadataKey, relations, target.constructor);
  };
}
export function HasOne(modelClass: () => any, join: IJoin) {
  return function (target: any, propertyKey: string) {
    const relations =
      Reflect.getMetadata(relationMetadataKey, target.constructor) || {};

    relations[propertyKey] = {
      relation: 'HasOne',
      modelClass,
      join,
    };

    Reflect.defineMetadata(relationMetadataKey, relations, target.constructor);
  };
}
export function ManyToMany(modelClass: () => any, join: IJoin) {
  return function (target: any, propertyKey: string) {
    const relations =
      Reflect.getMetadata(relationMetadataKey, target.constructor) || {};

    relations[propertyKey] = {
      relation: 'ManyToMany',
      modelClass,
      join,
    };

    Reflect.defineMetadata(relationMetadataKey, relations, target.constructor);
  };
}

export function Modifiers(name: string, fn: (builder: any) => any) {
  return function (target: any) {
    const existing =
      Reflect.getMetadata(modifierMetadataKey, target.constructor) || {};
    existing[name] = fn;
    Reflect.defineMetadata(modifierMetadataKey, existing, target.constructor);
  };
}

export function Modifier(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const modifiers =
    Reflect.getMetadata(modifierMetadataKey, target.constructor) || {};
  modifiers[propertyKey] = descriptor.value;
  Reflect.defineMetadata(modifierMetadataKey, modifiers, target.constructor);
}
