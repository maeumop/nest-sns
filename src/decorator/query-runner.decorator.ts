import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

export const QR = createParamDecorator((data, context) => {
  const req = context.switchToHttp().getRequest();

  if (!req.queryRunner) {
    throw new InternalServerErrorException(
      'QueryRunner Decorator를 사용하려면 TransactionInterceptor가 필요합니다.',
    );
  }

  return req.queryRunner;
});
