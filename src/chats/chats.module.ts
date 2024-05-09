import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatGateway } from './chats.gatway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/entity/users/user.entity';
import { ChatsModel } from 'src/entity/chats/chat.entity';
import { CommonModule } from 'src/api/common/common.module';
import { MessagesService } from './messages/messages.service';
import { MessagesModel } from 'src/entity/chats/message.entity';
import { MessagesController } from './messages/messages.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { UsersModule } from 'src/api/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, UsersModel, MessagesModel]),
    UsersModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsService, ChatGateway, MessagesService],
})
export class ChatsModule {}
