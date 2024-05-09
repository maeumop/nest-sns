import { CommentsModel } from 'src/entity/posts/comment.entity';
import { BasePaginateDto } from '../base-paginate.dto';

export class PaginateCommentDto extends BasePaginateDto<CommentsModel> {}
