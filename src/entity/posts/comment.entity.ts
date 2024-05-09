import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersModel } from '../users/user.entity';
import { BlogsModel } from './blog.entity';
import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from '../base.entity';

@Entity({
  name: 'comments',
})
export class CommentsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (model) => model.comment)
  author: UsersModel;

  @ManyToOne(() => BlogsModel, (model) => model.comments)
  blog: BlogsModel;

  @Column()
  @IsString()
  comment: string;

  @Column({
    default: 0,
  })
  @IsNumber()
  likeCount: number;
}
