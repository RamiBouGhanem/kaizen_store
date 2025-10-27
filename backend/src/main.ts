import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

/** Build the CORS allowlist from env + localhost in dev */
function getAllowedOrigins(): (string | RegExp)[] {
  const env = (process.env.FRONTEND_URLS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  // Always allow localhost dev servers
  return [/^http:\/\/localhost:\d+$/i, ...env];
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  // Global API prefix
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // Bind and listen
  const port = Number(process.env.PORT || 4000);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  console.log(`✅ API listening on ${baseUrl}/${globalPrefix}`);
}
bootstrap();
