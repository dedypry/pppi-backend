import { NestFactory } from '@nestjs/core';
import { WebsocketModule } from './websocket.module';
import { cors } from 'configs/cors';

async function bootstrap() {
  const app = await NestFactory.create(WebsocketModule);
  app.enableCors({
    origin: cors,
  });
  await app.listen(process.env.port ?? 3334);
}

bootstrap();
