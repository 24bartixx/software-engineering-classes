import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // frontend (5342?) łączy się z backendem (2137)
  app.useGlobalInterceptors(new LoggingInterceptor()); // interceptor dla każdego zapytania

  await app.listen(5432);
  console.log('Backend działa na http://localhost:2137');
}
bootstrap();
