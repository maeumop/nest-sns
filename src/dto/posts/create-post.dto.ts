import { PostsModel } from 'src/entity/posts/post.entity';
import { PickType } from '@nestjs/mapped-types';

/**
 * package: class-validator, class-trasnformer
 * Data Transfer Object
 * 받는 데이터를 검증하고, 추가로 받는 데이터를 정의 할 수 있음.
 */
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
