import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatGateway } from './chats.gatway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/entity/users/users.entity';
import { ChatsModel } from 'src/entity/chats/chat.entity';
import { CommonModule } from 'src/api/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatsModel, UsersModel]), CommonModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway],
})
export class ChatsModule {}
