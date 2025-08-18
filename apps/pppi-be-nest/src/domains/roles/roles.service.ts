import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import RoleCreateDto from './dto/create.dto';
import { RoleModel } from 'models/Role.model';
import slugify from 'slugify';
import { generateRandomString } from 'utils/helpers/global';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { AnyQueryBuilder } from 'objection';

@Injectable()
export class RolesService {
  async list(query: PaginationDto) {
    console.log('QUERY', query);
    const roles = RoleModel.query()
      .withGraphFetched('users(userLisr)')
      .modifiers({
        userLisr: (query: AnyQueryBuilder) =>
          query.select('users.id', 'users.name', 'users.email').limit(5),
      });

    if (query.page >= 0) {
      return await roles.page(query.page, query.pageSize);
    }

    return await roles;
  }

  async create(body: RoleCreateDto) {
    const slug = await this.findSlug(body.title);

    const bodyRole = {
      title: body.title,
      description: body.description,
      slug,
    };

    const role = await RoleModel.query().upsertGraphAndFetch({
      id: body.id,
      ...bodyRole,
    });

    if (body?.user_id?.length && role?.id) {
      console.log('MASUK', body);
      const roleId = role.id;
      await role?.$relatedQuery('users').for(roleId).unrelate();
      await role?.$relatedQuery('users').for(roleId).relate(body?.user_id);
    }

    return `Role ${body.id ? 'Updated' : 'Created'} Successfully!!!`;
  }

  async findSlug(slug: string) {
    let data = slugify(slug);

    const findSlug = await RoleModel.query().where('slug', slug);
    if (findSlug.length > 0) {
      data = await this.findSlug(`${data}-${generateRandomString(4)}`);
    }

    return data;
  }

  async destroy(id: number) {
    const role = await RoleModel.query().withGraphFetched('users').findById(id);

    if (!role) throw new NotFoundException('Role not found!!!');

    if (role.users.length > 0) {
      throw new BadRequestException('Update User Role');
    }

    await role.$query().delete();

    return 'Role deleted successfully!!!';
  }
}
