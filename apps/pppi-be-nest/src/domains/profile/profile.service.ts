import { Injectable } from '@nestjs/common';
import { UserModel } from 'models/User.model';

@Injectable()
export class ProfileService {
  async detail(id: number) {
    return await UserModel.query()
      .modify('list')
      .withGraphFetched('profile')
      .findById(id);
  }
}
