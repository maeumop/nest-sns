import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from 'src/api/blogs/comments/comments.service';
import { UsersModel } from 'src/entity/users/user.entity';
import { Request } from 'express';
import { UserRole } from 'src/types/users';

@Injectable()
export class RoleCommentGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user, params } = req;

    if (!user) {
      throw new UnauthorizedException('사용자 토큰이 없습니다!');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const commentId = parseInt(params.id);

    if (!commentId) {
      throw new BadRequestException('코멘트 id가 제공되지 않았습니다!');
    }

    const result = await this.commentsService.isMyComment(user.id, commentId);

    if (!result) {
      throw new ForbiddenException('해당 코멘트를 변경할 권한이 없습니다!');
    }

    return true;
  }
}
