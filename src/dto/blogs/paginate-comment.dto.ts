import { CommentsModel } from 'src/entity/blogs/comment.entity';
import { BasePaginateDto } from '../base-paginate.dto';

export class PaginateCommentDto extends BasePaginateDto<CommentsModel> {}
