import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        transform: true,
        enableDebugMessages: true,
    }),
);
  await app.listen(3000);
}
bootstrap();
