import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', 
    credentials: true,               
  });

  app.use(passport.initialize());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
