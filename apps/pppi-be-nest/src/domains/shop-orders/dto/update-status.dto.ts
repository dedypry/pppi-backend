import { IsIn, IsString } from 'class-validator';

export class UpdateShopOrderStatusDto {
  @IsString()
  @IsIn(['pending', 'processing', 'completed', 'cancelled'])
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}
