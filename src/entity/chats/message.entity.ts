import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../base.entity';
import { ChatsModel } from './chat.entity';
import { UsersModel } from '../users/user.entity';
import { IsString } from 'class-validator';

@Entity({
  name: 'messages',
})
export class MessagesModel extends BaseModel {
  @ManyToOne(() => ChatsModel, (model) => model.messages)
  chat: ChatsModel;

  @ManyToOne(() => UsersModel, (model) => model.messages)
  author: UsersModel;

  @Column()
  @IsString()
  message: string;
}
