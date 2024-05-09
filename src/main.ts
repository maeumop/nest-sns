import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalValidationPipe } from './pipe/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(globalValidationPipe);

  // 필터를 적용하여 http 오류를 관리
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}

bootstrap();
