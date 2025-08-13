import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BackgroundJobModel } from 'models/BackgroundJob.model';
import { ProfileModel } from 'models/Profile.model';
import { RoleModel } from 'models/Role.model';
import { UserModel } from 'models/User.model';
import { toIsoString } from 'utils/helpers/date-format';
import { getImageFromUrl } from 'utils/services/download-file';

@Injectable()
export class BackgroundJobsService {
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCreateUser() {
    const cron = await BackgroundJobModel.query()
      .where('status', 'success')
      .page(0, 20);

    for (const item of cron.results) {
      const body = item.data;
      const user = await UserModel.query()
        .where('email', body.user.email)
        .joinRelated('profile')
        .whereNull('profile.photo')
        .first();

      // console.log(user);
      if (user) {
        const photo = await getImageFromUrl(body.profile.photo);
        const member_payment_file = await getImageFromUrl(
          body.profile.member_payment_file,
          'payment_files',
        );

        await ProfileModel.query().where('user_id', user.id).update({
          photo,
          member_payment_file,
        });
        console.log('SUCCESS');
      }
      // const body = item.data;

      // const ttl = toIsoString(body.profile.date_birth);

      // console.log('TTL', toIsoString(body.profile.date_birth));

      // if (ttl) {
      //   await this.createUserAuto(
      //     body.user,
      //     {
      //       ...body.profile,
      //       date_birth: toIsoString(body.profile.date_birth),
      //     },
      //     item.id,
      //   );
      // } else {
      //   await BackgroundJobModel.query()
      //     .findById(item.id)
      //     .update({
      //       status: 'error',
      //       error: {
      //         id: item.id,
      //         data: body.profile.date_birth,
      //       },
      //     });
      // }
    }
    console.log('JALAN', cron.total);
  }

  async createUserAuto(
    bodyUser: UserModel,
    bodyProfile: ProfileModel,
    id: number,
  ) {
    try {
      const profile: any = await UserModel.transaction(async (trx) => {
        const find = await UserModel.query(trx).findOne(
          'email',
          bodyUser.email!,
        );
        if (find) {
          await BackgroundJobModel.query(trx).findById(id).update({
            status: 'success',
          });

          return null;
        }

        const user = await UserModel.query(trx).insertGraphAndFetch(bodyUser);
        delete (bodyProfile as any).status;
        const profileD = await ProfileModel.query(trx).insert({
          user_id: user.id,
          ...bodyProfile,
        });
        const role = await RoleModel.query(trx).findOne('title', 'member');
        await role?.$relatedQuery('users', trx).relate(user.id);

        await BackgroundJobModel.query(trx).findById(id).update({
          status: 'success',
        });

        console.log('SUCCESS CREATE USER');
        return profileD;
      });

      if (profile) {
        const photo = await getImageFromUrl(profile.photo);
        const member_payment_file = await getImageFromUrl(
          profile.member_payment_file,
          'payment_files',
        );

        await ProfileModel.query().findById(profile.id).update({
          photo,
          member_payment_file,
        });
      }
    } catch (error) {
      console.error('CREATE MEMBER ', bodyUser, error);
      await BackgroundJobModel.query().findById(id).update({
        error: {
          error,
        },
      });
      return null;
    }
  }
}
