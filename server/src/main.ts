import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // frontend łączy się z backendem
  app.useGlobalInterceptors(new LoggingInterceptor()); // interceptor dla każdego zapytania

  await app.listen(process.env.PORT || 3000);
  console.log(`Backend działa na http://localhost:${process.env.PORT || 3000}}`);
}
bootstrap();
