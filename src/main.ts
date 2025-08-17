import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // CORS configuration - critical for cookies in cross-origin requests
  app.enableCors({
    origin: process.env.FRONTEND_URL, 
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,  // Allows cookies to be sent cross-origin
  });

  app.use(passport.initialize());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
