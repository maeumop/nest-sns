import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from 'src/entity/image.entity';

export class CreatePostImageDto extends PickType(ImageModel, [
  'path',
  'post',
  'order',
  'type',
]) {}
