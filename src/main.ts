import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const port = app.get(AppModule).getListenPort();
  await app.listen(port);
  console.log('Hi!');
  logger.log(`Server is running on port:${port}`);
}

bootstrap();
