import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/api/common/common.service';
import { BasePaginateDto } from 'src/dto/base-paginate.dto';
import { CreateMessageDto } from 'src/dto/chats/create-message.dto';
import { MessagesModel } from 'src/entity/chats/message.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly repository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  paginateMessage(
    dto: BasePaginateDto<MessagesModel>,
    overrideOptions: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.paginate<MessagesModel>(
      dto,
      this.repository,
      overrideOptions,
      'messages',
    );
  }

  async createMessage(dto: CreateMessageDto, authorId: number) {
    const result = await this.repository.save({
      chat: {
        id: dto.chatId,
      },
      author: {
        id: authorId,
      },
      message: dto.message,
    });

    return this.repository.findOne({
      where: {
        id: result.id,
      },
    });
  }
}
