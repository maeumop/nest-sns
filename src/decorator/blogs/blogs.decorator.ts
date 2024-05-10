import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { BlogsModel } from 'src/entity/blogs/blog.entity';

export const Blog = createParamDecorator(
  (data: keyof BlogsModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const blog = req.blog as BlogsModel;

    if (!blog) {
      throw new InternalServerErrorException();
    }

    return data;
  },
);
