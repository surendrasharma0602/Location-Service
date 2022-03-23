import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as csurf from 'csurf';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['log', 'error', 'debug', 'verbose'],
  });
  // app.use(csurf());
  await app.listen(3000);
}
bootstrap();
