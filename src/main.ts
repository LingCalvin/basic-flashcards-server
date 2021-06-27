import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { MisconfiguredException } from './common/exceptions/misconfigured.exception';
import { RedocModule } from 'nestjs-redoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const swaggerUiEnabled = process.env.SWAGGER_UI_ENABLE;
  const swaggerUiUrl = process.env.SWAGGER_UI_URL ?? '';
  if (swaggerUiEnabled && !swaggerUiUrl) {
    throw new MisconfiguredException(
      'SWAGGER_UI_URL must be set if SWAGGER_UI_ENABLE is true.',
    );
  }

  const redocEnabled = process.env.REDOC_ENABLE;
  const redocURL = process.env.REDOC_URL ?? '';

  if (redocEnabled && !redocURL) {
    throw new MisconfiguredException(
      'REDOC_URL must be set if REDOC_ENABLE is true.',
    );
  }

  let swaggerDoc;

  if (swaggerUiEnabled || redocEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Basic Flashcards')
      .setVersion(process.env.npm_package_version ?? 'unknown')
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .addCookieAuth('accessToken')
      .build();

    swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  }

  if (swaggerUiEnabled && swaggerDoc !== undefined) {
    SwaggerModule.setup(swaggerUiUrl, app, swaggerDoc, {
      customSiteTitle: 'API Documentation | Basic Flashcards',
    });
  }

  if (redocEnabled && swaggerDoc !== undefined) {
    await RedocModule.setup(redocURL, app, swaggerDoc, {
      title: 'API Documentation | Basic Flashcards',
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
