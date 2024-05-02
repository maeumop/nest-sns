import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/entity/users/users.entity';
import { UsersService } from 'src/api/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  /**
   * authorization에서 토큰 정보를 가져와 토큰 문자열만 반환한다.
   * @param rawToken
   * @param isBearer
   */
  getTokenString(rawToken: string, isBearer: boolean = false) {
    const [type, token] = rawToken.split(' ');

    const needType = isBearer ? 'Bearer' : 'Basic';

    if (type !== needType || !token) {
      throw new UnauthorizedException('잘못된 토큰 정보입니다!(1)');
    }

    return token;
  }

  /**
   * basic 토큰 decoding
   * @param base64
   * @returns
   */
  decodeBasicToken(base64: string) {
    const [email, password] = Buffer.from(base64, 'base64')
      .toString('utf8')
      .split(':');

    if (!email || !password) {
      throw new UnauthorizedException('잘못된 토큰 정보입니다!(2)');
    }

    return {
      email,
      password,
    };
  }

  /**
   * token 검증
   * @param token
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException(
        '토큰이 만료 되었거나, 잘못된 토큰 입니다.',
      );
    }
  }

  /**
   * 토큰 재발급
   * @param token
   * @param isRefresh 리프래시 토큰을 재발급 받을지 여부
   * @returns
   */
  reissueToken(token: string, isRefresh: boolean = false) {
    const decoded = this.jwtService.verify(token, {
      secret: this.config.get<string>('JWT_SECRET'),
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('재발급이 불가능한 토큰입니다.');
    }

    return this.signToken(decoded, isRefresh);
  }

  /**
   * 토큰 문자열 생성
   * @param user
   * @param isRefresh refresh token 여부
   * @returns
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefresh: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefresh ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: isRefresh ? 3600 : 300,
    });
  }

  /**
   * access, refresh Token 발급
   * @param user 사용자 정보
   * @returns
   */
  getTokens(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  /**
   * 이메일과 비밀번호를 통해 사용자 인증
   * @param user 사용자 정보
   * @returns
   */
  async authenticate(user: Pick<UsersModel, 'email' | 'password'>) {
    const exists = await this.usersService.getUserByEmail(user.email);

    if (!exists) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
    }

    const isPass = await bcrypt.compare(user.password, exists.password);

    if (!isPass) {
      throw new UnauthorizedException('비밀번호가 맞지 않습니다.');
    }

    return exists;
  }

  /**
   * 이메일과 비밀번호 로그인
   * @param user
   * @returns
   */
  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existsUser = await this.authenticate(user);

    return this.getTokens(existsUser);
  }

  /**
   * 이메일로 사용자 등록
   * @param user
   * @returns
   */
  async registerWithEmail(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ) {
    const hash = await bcrypt.hash(
      user.password,
      this.config.get<number>('HASH_ROUNDS'),
    );

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.getTokens(newUser);
  }
}
