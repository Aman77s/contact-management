import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:5173', 
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle("Contact Manager API")
    .setDescription("API for user authencation or managing contacts")
    .setVersion('1.0')
    .addBearerAuth(
          {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access_token',
    )
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
