import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/modules/app/app.module';
import { CONFIG } from '@/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(CONFIG.CORS);
  app.setGlobalPrefix('api/v1');

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('API documentation for the Tasks system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('/docs', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(CONFIG.PORT).then(() => {
    Logger.log(`Running on port: ${CONFIG.PORT}`, NestApplication.name);
  });
}

void bootstrap();
