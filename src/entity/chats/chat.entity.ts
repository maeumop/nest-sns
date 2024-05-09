import { Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseModel } from '../base.entity';
import { UsersModel } from '../users/user.entity';
import { MessagesModel } from './message.entity';

@Entity({
  name: 'chats',
})
export class ChatsModel extends BaseModel {
  @ManyToMany(() => UsersModel, (model) => model.chats)
  users: UsersModel[];

  @OneToMany(() => MessagesModel, (model) => model.chat)
  messages: MessagesModel;
}
