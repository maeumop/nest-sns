import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ImageModelType } from 'src/types/common';
import { POST_URL_PATH, USER_URL_PATH } from 'src/common/path';
import { join } from 'path';
import { Transform } from 'class-transformer';
import { BlogsModel } from './posts/blog.entity';

@Entity({
  name: 'upload_files',
})
export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({
    enum: ImageModelType,
  })
  @IsEnum(ImageModelType)
  type: ImageModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageModelType.POST) {
      return `/${join(POST_URL_PATH, value)}`;
    } else if (obj.type === ImageModelType.USER) {
      return `/${join(USER_URL_PATH, value)}`;
    }

    return value;
  })
  path: string;

  @ManyToOne(() => BlogsModel, (model) => model.images)
  blog: BlogsModel;
}
