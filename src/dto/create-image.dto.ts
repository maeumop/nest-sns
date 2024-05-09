import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from 'src/entity/image.entity';

export class CreateBlogImageDto extends PickType(ImageModel, [
  'path',
  'blog',
  'order',
  'type',
]) {}
