import { Module } from '@nestjs/common';

/**
 * Realtime blog comments moved to Pusher via the main API.
 * This app remains as a lightweight process for existing PM2 deploy targets.
 */
@Module({})
export class WebsocketModule {}
