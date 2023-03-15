import { SessionConfigurations } from '@configs/session-configurations';
import swaggerConfig from '@configs/swagger-configurations';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as flash from 'connect-flash';
import * as passport from 'passport';
import * as ejsExtend from 'express-ejs-extend';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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

  // app.setGlobalPrefix('api/v1', {
  //   exclude: [
  //     {
  //       path: '/',
  //       method: RequestMethod.GET,
  //     },
  //   ],
  // });
  app.enableCors({
    origin: '*',
  });
  app.use(session(SessionConfigurations.config));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.use(flash());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('ejs', ejsExtend);
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppModule.port);
}
bootstrap();
