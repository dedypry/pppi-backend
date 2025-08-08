import { NestFactory } from '@nestjs/core';
import { FileUploadModule } from './file-upload.module';

async function bootstrap() {
  const app = await NestFactory.create(FileUploadModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
