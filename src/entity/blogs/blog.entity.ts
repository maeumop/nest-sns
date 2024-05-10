import { IsString } from 'class-validator';
import { Util } from 'src/common/utils';
import { BaseModel } from 'src/entity/base.entity';
import { UsersModel } from 'src/entity/users/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ImageModel } from '../image.entity';
import { CommentsModel } from './comment.entity';

@Entity({
  name: 'blog',
})
export class BlogsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (model) => model.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsString({ message: (args) => Util.validatorMsg(args) })
  title: string;

  @Column()
  @IsString({ message: (args) => Util.validatorMsg(args) })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @OneToMany(() => ImageModel, (model) => model.blog)
  images: ImageModel[];

  @OneToMany(() => CommentsModel, (model) => model.blog)
  comments: CommentsModel[];
}
