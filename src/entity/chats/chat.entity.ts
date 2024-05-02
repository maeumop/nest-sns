import { Entity, ManyToMany } from 'typeorm';
import { BaseModel } from '../base.entity';
import { UsersModel } from '../users/users.entity';

@Entity()
export class ChatsModel extends BaseModel {
  @ManyToMany(() => UsersModel, (model) => model.chats)
  users: UsersModel[];
}
