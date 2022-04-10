import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  // app.setGlobalPrefix('v1/api/');
  //eable cors
  app.enableCors();

  await app.listen(3100);
}
bootstrap().catch((err) => {
  console.error(err);
});
