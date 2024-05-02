import { PostsModel } from 'src/entity/posts/post.entity';
import { FindManyOptions } from 'typeorm';

export const POST_DEFAULT_FIND_OPTIONS: FindManyOptions<PostsModel> = {
  relations: {
    author: true,
    images: true,
  },
};
