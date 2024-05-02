import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // DTO 등에 기본값 설정을 가능하게 해주는 옵션
      transform: true,
      transformOptions: {
        // transform이 이루어 질때 validator 설정된 값에 맞춰서 변경 할 수 있도록 설정
        // validator에 IsString 외의 형식을 (IsNumber, IsBoolean 등으로 설정 후) querystring, body 등으로 전달되는 값을
        // 자동으로 해당 type으로 변경 해준다.
        enableImplicitConversion: true,
      },
      // DTO에 적용되지 않은 인자는 모두 제거 하는 기능
      whitelist: true,
      // DTO 에 적용되지 않은 인자를 보낼경우 오류 발생
      forbidNonWhitelisted: true,
    }),
  );

  // 필터를 적용하여 http 오류를 관리
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}

bootstrap();
