import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { BasePaginateDto } from 'src/dto/base-paginate.dto';
import { MessagesModel } from 'src/entity/chats/message.entity';

@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  paginateMessage(
    @Param('chatId') id: number,
    @Query() dto: BasePaginateDto<MessagesModel>,
  ) {
    return this.messagesService.paginateMessage(dto, {
      where: {
        chat: {
          id,
        },
      },
      relations: {
        author: true,
        chat: true,
      },
    });
  }
}
