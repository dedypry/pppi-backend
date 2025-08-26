import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthQueueProcessor } from '../../queue/auth.queue.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'AUTH-QUEUE',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthQueueProcessor],
})
export class AuthModule {}
