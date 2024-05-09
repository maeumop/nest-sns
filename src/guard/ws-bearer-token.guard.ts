import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/api/auth/auth.service';
import { UsersService } from 'src/api/users/users.service';

@Injectable()
export class WsBearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const rawToken = socket.handshake.headers['authorization'];

    if (!rawToken) {
      throw new WsException('토큰이 없습니다(Bearer)');
    }

    try {
      const token = this.authService.getTokenString(rawToken, true);
      const result = await this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(result.email);

      socket.token = token;
      socket.tokenType = result.type;
      socket.user = user;

      return true;
    } catch (e) {
      console.log(e);
      throw new WsException('유효하지 않은 토큰 입니다.');
    }
  }
}
