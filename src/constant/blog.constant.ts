import { BlogsModel } from 'src/entity/blogs/blog.entity';
import { CommentsModel } from 'src/entity/blogs/comment.entity';
import { FindManyOptions } from 'typeorm';

export const BLOG_DEFAULT_FIND_OPTIONS: FindManyOptions<BlogsModel> = {
  relations: {
    author: true,
    images: true,
  },
};

export const COMMENT_DEFAULT_FIND_OPTIONS: FindManyOptions<CommentsModel> = {
  relations: {
    author: true,
  },
  select: {
    author: {
      nickname: true,
      id: true,
      email: true,
    },
  },
};
