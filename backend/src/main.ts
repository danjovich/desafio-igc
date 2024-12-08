import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/authentication/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log', 'verbose'],
  });

  // every route is protected
  app.useGlobalGuards(new JwtAuthGuard());

  await app.listen(3000);
}

bootstrap();
