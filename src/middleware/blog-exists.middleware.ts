import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
// NextFunction, Request, Response 클래스는 common package 에도 포함되어 있기 때문에
// 작성시 유의 할 것
import { NextFunction, Request, Response } from 'express';
import { BlogsService } from 'src/api/blogs/blogs.service';

@Injectable()
export class BlogExistsMiddleware implements NestMiddleware {
  constructor(private readonly blogsService: BlogsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const blogId = parseInt(req.params.blogId);

    if (!blogId) {
      throw new BadRequestException('blog id가 전달되지 않았습니다.');
    }

    const exists = await this.blogsService.blogExistsById(blogId);

    if (!exists) {
      throw new BadRequestException('blog가 존재하지 않습니다.');
    }

    next();
  }
}
