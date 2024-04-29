import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from '../../entity/users/users.entity';

/**
 * 사용자 생성 decorator
 */
export const User = createParamDecorator(
  // data에 필터링 하고 싶은 문자열을 받아 해당 값만 필터링하여 보낼수 있다.
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UsersModel;

    if (!user) {
      throw new InternalServerErrorException(
        'Request 정보에 user 프로퍼티가 없습니다. AccessTokenGuard 사용여부를 확인해주세요.',
      );
    }

    return data ? user[data] : user;
  },
);
