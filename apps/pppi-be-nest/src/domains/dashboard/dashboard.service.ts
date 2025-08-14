import { Injectable } from '@nestjs/common';
import { UserModel } from 'models/User.model';

@Injectable()
export class DashboardService {
  async dataMember() {
    const submission = await this.getStatus();
    const approved = await this.getStatus('approved');
    const rejected = await this.getStatus('rejected');

    return { submission, approved, rejected };
  }
  async getStatus(status: string = 'submission') {
    const { count }: any = await UserModel.query()
      .where('status', status)
      .count()
      .first();

    return Number(count);
  }
}
