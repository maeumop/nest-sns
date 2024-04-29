import { Headers, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from '../../guard/auth/basic-token.guard';
import { RefreshTokenGuard } from '../../guard/auth/bearer-token.guard';
import { RegisterUserDto } from 'src/dto/auth/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postReissueAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.getTokenString(rawToken, true);
    const newToken = this.authService.reissueToken(token);

    return { accessToken: newToken };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postReissueRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.getTokenString(rawToken, true);
    const newToken = this.authService.reissueToken(token, true);

    return { refreshToken: newToken };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.getTokenString(rawToken, false);
    const { email, password } = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail({ email, password });
  }

  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    const { nickname, email, password } = body;

    return this.authService.registerWithEmail({
      nickname,
      email,
      password,
    });
  }
}
