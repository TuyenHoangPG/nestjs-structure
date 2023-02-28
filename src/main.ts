import swaggerConfig from '@configs/swagger-configurations';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const hostDomain = AppModule.isDev ? `${AppModule.host}:${AppModule.port}` : AppModule.host;

  if (AppModule.isDev) {
    const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api/docs', app, swaggerDoc, {
      swaggerUrl: `${hostDomain}/api/docs/swagger.json`,
      explorer: true,
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });
  }

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppModule.port);
}
bootstrap();
