/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from 'models/User.model';
import {
  UpdateBioDto,
  UpdatePasswordeDto,
  UpdatePhotoProfileDto,
  UpdateProfileDto,
} from './dto/update.dto';
import { ProfileModel } from 'models/Profile.model';
import { generateNia } from 'utils/services/user.service';
import * as dayjs from 'dayjs';
import {
  destroyFile,
  setFileParent,
} from 'utils/services/file-gallery.service';
import { comparePassword, hashPassword } from 'utils/helpers/bcrypt';

@Injectable()
export class ProfileService {
  async detail(id: number) {
    return await UserModel.query()
      .modify('list')
      .withGraphFetched('[profile.[province, city, district], roles]')
      .findById(id);
  }

  async updateProfile(body: UpdateProfileDto, userId: number) {
    const user = await UserModel.query().findById(userId);

    if (!user) throw new NotFoundException();

    await UserModel.transaction(async (trx) => {
      let nia = '';
      if (!user.nia) {
        const genNia = await generateNia({
          provinceId: body.province_id,
          cityId: body.city_id,
          joinYear: Number(dayjs(user.created_at).format('YY')),
          dateBirth: body.date_birth,
        });

        nia = genNia.nia;
      }

      await user.$query(trx).update({
        name: body.name,
        email: body.email,
        front_title: body.front_title,
        back_title: body.back_title,
        ...(nia && {
          nia,
        }),
      });

      const payloadProfile = {
        user_id: user.id,
        nik: body.nik,
        place_birth: body.place_birth,
        date_birth: body.date_birth,
        gender: body.gender,
        citizenship: body.citizenship,
        address: body.address,
        province_id: body.province_id,
        city_id: body.city_id,
        district_id: body.district_id,
        phone: body.phone,
        last_education: body.last_education,
        last_education_nursing: body.last_education_nursing,
        workplace: body.workplace,
      };

      const profile = await ProfileModel.query(trx).findOne('user_id', user.id);

      if (profile) {
        await profile.$query(trx).update(payloadProfile);
      } else {
        await ProfileModel.query(trx).insert(payloadProfile);
      }
    });

    return 'Data Profile berhasil di ubah';
  }

  async updatePhotoProfile(body: UpdatePhotoProfileDto, userId: number) {
    const profile = await ProfileModel.query().findOne('user_id', userId);

    if (!profile) throw new NotFoundException();

    destroyFile({
      url: profile.photo,
    });

    await profile.$query().update({
      photo: body.photo,
    });

    setFileParent(body.photo, profile);

    return 'Photo Profile berhasil di perbarui';
  }

  async updatePassword(body: UpdatePasswordeDto, userId: number) {
    const user = await UserModel.query().findById(userId);

    if (!user) throw new NotFoundException();

    const validate = comparePassword(body.password, user.password);

    if (!validate) throw new ForbiddenException('Password salah');

    await user.$query().update({
      password: hashPassword(body.new_password),
    });

    return 'Password Berhasil di ubah';
  }

  async updateBio(body: UpdateBioDto, userId: number) {
    const user = await UserModel.query().findById(userId);

    if (!user) throw new NotFoundException();

    await user.$query().update({
      bio: body.bio,
    });

    return 'Bio berhasil di ubah';
  }
}
