import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('members')
export class MemberModel extends Model {
  nik: string;
  front_title: string;
  back_title: string;
  name: string;
  email: string;
  place_birth: string;
  date_birth: string;
  gender: 'male' | 'female';
  citizenship: string;
  address: string;
  province_id: number;
  city_id: number;
  district_id: number;
  phone: string;
  last_education_nursing: string;
  last_education?: string;
  workplace: string;
  hope_in?: string;
  contribution?: string;
  is_member_payment: boolean;
  reason_reject?: string | null;
  photo: string;
  member_payment_file?: string;
}
