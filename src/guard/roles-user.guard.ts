import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorator/users/role.decorator';

@Injectable()
export class RolesUserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Roles annotation에 대한 metadata 호출
    // Reflector
    // Role 설정된 가장 가까운 설정 값을 가져 온다.
    // getAllAndOverride 함수에 설정된 key값을 기준으로.
    const role = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Roles Annotation 설정이 없을 경우
    if (!role) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException(
        '사용자 정보를 확인 할 수 있는 토큰이 없습니다! [Roles]',
      );
    }

    if (user.role !== role) {
      throw new ForbiddenException(
        `사용 권한 role 설정'해당 기능을 수행할 수 있는 권한을 갖은 사용자가 아닙니다. [${role}]`,
      );
    }

    return true;
  }
}
