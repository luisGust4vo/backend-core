// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS se for acessar de um front separado
  app.enableCors();

  // Ativa validações automáticas com os DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Sobe o servidor na porta desejada (env.PORT ou 3000)
  await app.listen(process.env.PORT || 8033);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
