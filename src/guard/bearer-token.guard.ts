import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../api/auth/auth.service';
import { UsersService } from 'src/api/users/users.service';
import { Reflector } from '@nestjs/core';
import { PUBLIC_API_KEY } from 'src/decorator/public-api.decorator';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    if (!isPublic) {
      const rawToken = req.headers['authorization'];

      if (!rawToken) {
        throw new UnauthorizedException('토큰이 없습니다(Bearer)');
      }

      const token = this.authService.getTokenString(rawToken, true);
      const result = await this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(result.email);

      req.token = token;
      req.tokenType = result.type;
      req.user = user;
    }

    req.isRoutePublic = isPublic;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (!req.isRoutePublic && req.tokenType !== 'access') {
      throw new UnauthorizedException('엑세스 토큰이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (!req.isRoutePublic && req.tokenType !== 'refresh') {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다.');
    }

    return true;
  }
}
