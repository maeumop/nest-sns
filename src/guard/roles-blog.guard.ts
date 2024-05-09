import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogsService } from 'src/api/blogs/blogs.service';
import { UsersModel } from 'src/entity/users/user.entity';
import { UserRole } from 'src/types/users';
import { Request } from 'express';

@Injectable()
export class RoleBlogGuard implements CanActivate {
  constructor(private readonly blogsService: BlogsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };
    const { user, params } = req;

    if (!user) {
      throw new UnauthorizedException('사용자 토큰이 없습니다!');
    }

    if (!params) {
      throw new BadRequestException('Blog Id가 제공되지 않았습니다.');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const result = await this.blogsService.isMyBlog(
      user.id,
      parseInt(params.id),
    );

    if (!result) {
      throw new ForbiddenException('해당 블로그 변경 권한이 없습니다!');
    }

    return true;
  }
}
