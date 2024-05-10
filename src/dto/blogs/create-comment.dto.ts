import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from 'src/entity/blogs/comment.entity';

export class CreateCommentDto extends PickType(CommentsModel, ['comment']) {}
