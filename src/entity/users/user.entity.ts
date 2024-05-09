import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { UserRole } from 'src/types/users';
import { BlogsModel } from 'src/entity/posts/blog.entity';
import { BaseModel } from 'src/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { Util } from 'src/common/utils';
import { Exclude } from 'class-transformer';
import { ChatsModel } from '../chats/chat.entity';
import { MessagesModel } from '../chats/message.entity';
import { CommentsModel } from '../posts/comment.entity';
import { UserFollowModel } from './user-follow.entity';

/**
 * entity에서 property를 선택적으로 노출하고 싶다면
 * entity 자체에 Exclude annotation을 걸어주고
 * 노출할 property만 Expose annotation으로 노출 설정 할 수 있다.
 */
@Entity({
  name: 'users',
})
export class UsersModel extends BaseModel {
  @Column()
  @IsString({ message: (args) => Util.validatorMsg(args) })
  @Length(1, 20, {
    message: (args) => Util.validatorLen(args),
  })
  nickname: string;

  @Column()
  @IsString({ message: (args) => Util.validatorMsg(args) })
  @IsEmail()
  email: string;

  // Exclude와 반대의 기능
  // get의 경우 기본적으로 노출 되지 않음
  // @Expose()
  // get nicknameAndEmail(): string {
  //   return `${this.nickname}/${this.email}`;
  // }

  @Column()
  @IsString({ message: (args) => Util.validatorMsg(args) })
  @Length(4, 14, {
    message: (args) => Util.validatorLen(args),
  })
  /**
   * toClassOnly: front-end -> back-end (Request)
   * toPlainOnly: back-end -> front-end (Response)
   */
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => BlogsModel, (model) => model.author)
  posts: BlogsModel[];

  // many to many에서는 한쪽 테이블에 JoinTable annotation이 필요하다
  @ManyToMany(() => ChatsModel, (model) => model.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => CommentsModel, (model) => model.author)
  comment: CommentsModel[];

  @OneToMany(() => MessagesModel, (model) => model.author)
  messages: MessagesModel[];

  @OneToMany(() => UserFollowModel, (model) => model.follower)
  followers: UserFollowModel;

  @OneToMany(() => UserFollowModel, (model) => model.followee)
  followeese: UserFollowModel;

  @Column({
    default: 0,
  })
  followerCount: number;

  @Column({
    default: 0,
  })
  followeeCount: number;
}
