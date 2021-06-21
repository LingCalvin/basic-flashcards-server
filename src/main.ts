import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { MisconfiguredException } from './common/exceptions/misconfigured.exception';

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

  if (swaggerUiEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Basic Flashcards')
      .setVersion(process.env.npm_package_version ?? 'unknown')
      .addSecurity('bearer token', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .addCookieAuth('accessToken')
      .build();

    const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerUiUrl, app, swaggerDoc);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
