import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'AUTH-QUEUE',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
