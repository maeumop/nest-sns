import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../base.entity';
import { UsersModel } from './user.entity';

@Entity({
  name: 'user_follow',
})
export class UserFollowModel extends BaseModel {
  @ManyToOne(() => UsersModel, (model) => model.followers)
  follower: UsersModel;

  @ManyToOne(() => UsersModel, (model) => model.followeese)
  followee: UsersModel;

  @Column({
    default: false,
  })
  isConfirm: boolean;
}
