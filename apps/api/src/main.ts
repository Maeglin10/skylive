import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { json, raw } from 'express';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Validates required and optional environment variables at startup
 */
function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';

  // Required variables (all environments)
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter(k => !process.env[k]);

  if (missing.length) {
    console.error(`[ENV_VALIDATION] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Validate JWT_SECRET and JWT_REFRESH_SECRET minimum length
  const jwtSecret = process.env.JWT_SECRET || '';
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || '';

  if (jwtSecret.length < 32) {
    console.error(`[ENV_VALIDATION] JWT_SECRET must be at least 32 characters (current: ${jwtSecret.length})`);
    process.exit(1);
  }

  if (jwtRefreshSecret.length < 32) {
    console.error(`[ENV_VALIDATION] JWT_REFRESH_SECRET must be at least 32 characters (current: ${jwtRefreshSecret.length})`);
    process.exit(1);
  }

  // Optional variables with warnings in production
  const optional = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'REDIS_URL', 'RESEND_API_KEY', 'AWS_ACCESS_KEY_ID'];

  if (isProduction) {
    const missingOptional = optional.filter(k => !process.env[k]);
    if (missingOptional.length) {
      console.warn(`[ENV_VALIDATION] Missing optional environment variables in production: ${missingOptional.join(', ')}`);
    }
  }

  console.log('[ENV_VALIDATION] All required environment variables validated');
}

async function bootstrap() {
  // Validate environment variables before initializing the app
  validateEnv();
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENV || process.env.NODE_ENV || 'development',
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
    });
  }

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.setGlobalPrefix('api');

  app.use('/api/payments/webhook', raw({ type: '*/*' }));
  app.use((req, _res, next) => {
    if (req.originalUrl === '/api/payments/webhook' && Buffer.isBuffer(req.body)) {
      (req as any).rawBody = req.body;
    }
    next();
  });
  app.use(json());

  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Skylive API')
    .setDescription('Skylive backend API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
}

bootstrap();
