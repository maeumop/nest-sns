import { BlogsModel } from 'src/entity/blogs/blog.entity';
import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

/**
 * package: class-validator, class-trasnformer
 * Data Transfer Object
 * 받는 데이터를 검증하고, 추가로 받는 데이터를 정의 할 수 있음.
 */
export class CreateBlogDto extends PickType(BlogsModel, ['title', 'content']) {
  @IsString({
    each: true,
  })
  @IsOptional()
  images: string[] = [];
}
