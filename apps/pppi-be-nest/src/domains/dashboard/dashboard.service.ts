import { Injectable } from '@nestjs/common';
import { UserModel } from 'models/User.model';

@Injectable()
export class DashboardService {
  async dataMember() {
    const [submission, approved, rejected, total, needVerify] =
      await Promise.all([
        this.countByStatus('submission'),
        this.countByStatus('approved'),
        this.countByStatus('rejected'),
        this.countMembers(),
        this.countNeedVerify(),
      ]);

    const [
      verifyPending,
      verifyReVerified,
      verifySubmitted,
      verifyApproved,
      verifyRejected,
    ] = await Promise.all([
      this.countByVerificationStatus('pending'),
      this.countByVerificationStatus('re_verified'),
      this.countByVerificationStatus('submitted'),
      this.countByVerificationStatus('approved'),
      this.countByVerificationStatus('rejected'),
    ]);

    const recent = await this.recentMembers(8);

    return {
      members: {
        total,
        submission,
        approved,
        rejected,
      },
      verification: {
        need_verify: needVerify,
        pending: verifyPending,
        re_verified: verifyReVerified,
        submitted: verifySubmitted,
        approved: verifyApproved,
        rejected: verifyRejected,
      },
      recent,
      // keep legacy fields for any old consumers
      submission,
      approved,
      rejected,
    };
  }

  private memberBaseQuery() {
    return UserModel.query().whereExists(
      UserModel.relatedQuery('roles').where('title', 'member'),
    );
  }

  async countMembers() {
    const { count }: any = await this.memberBaseQuery().count().first();
    return Number(count);
  }

  async countByStatus(status: string = 'submission') {
    const { count }: any = await this.memberBaseQuery()
      .where('status', status)
      .count()
      .first();
    return Number(count);
  }

  async countNeedVerify() {
    const { count }: any = await this.memberBaseQuery()
      .where('is_need_verify', true)
      .count()
      .first();
    return Number(count);
  }

  async countByVerificationStatus(status: string) {
    const { count }: any = await this.memberBaseQuery()
      .where('verification_status', status)
      .count()
      .first();
    return Number(count);
  }

  async recentMembers(limit = 8) {
    return await this.memberBaseQuery()
      .modify('list')
      .withGraphFetched('profile')
      .orderBy('users.created_at', 'desc')
      .limit(limit)
      .then((rows) =>
        rows.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          front_title: user.front_title,
          back_title: user.back_title,
          status: user.status,
          verification_status: user.verification_status,
          is_need_verify: user.is_need_verify,
          is_verified: user.is_verified,
          created_at: user.created_at,
          photo: user.profile?.photo || null,
        })),
      );
  }
}
