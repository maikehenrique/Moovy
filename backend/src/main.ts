import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public' });
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization'
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 9000);
}
bootstrap();
