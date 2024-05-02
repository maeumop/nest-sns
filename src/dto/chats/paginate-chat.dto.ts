import { ChatsModel } from 'src/entity/chats/chat.entity';
import { BasePaginateDto } from '../base-paginate.dto';

export class PaginateChatDto extends BasePaginateDto<ChatsModel> {}
