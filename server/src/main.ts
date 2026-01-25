import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // frontend łączy się z backendem
  app.useGlobalPipes(new ValidationPipe()); // validation
  app.useGlobalInterceptors(new LoggingInterceptor()); // interceptor dla każdego zapytania

  const options = new DocumentBuilder()
    .setTitle('TeamBuilder API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(
    `Backend działa na http://localhost:${process.env.PORT || 3000}}`,
  );
}
bootstrap();
