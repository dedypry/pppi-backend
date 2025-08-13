import { NestFactory } from '@nestjs/core';
import { BackgroundJobsModule } from './background-jobs.module';

async function bootstrap() {
  const app = await NestFactory.create(BackgroundJobsModule);
  await app.listen(process.env.port ?? 3335);
}
bootstrap();
