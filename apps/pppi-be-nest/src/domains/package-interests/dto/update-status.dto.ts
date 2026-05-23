import { IsIn, IsString } from 'class-validator';

export class UpdatePackageInterestStatusDto {
  @IsString()
  @IsIn(['new', 'follow_up', 'closed'])
  status: 'new' | 'follow_up' | 'closed';
}
