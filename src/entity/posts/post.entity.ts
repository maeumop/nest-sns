import { IsString } from 'class-validator';
import { Util } from 'src/common/utils';
import { BaseModel } from 'src/entity/base.entity';
import { UsersModel } from 'src/entity/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
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
}
