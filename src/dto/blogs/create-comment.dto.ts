import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from 'src/entity/posts/comment.entity';

export class CreateCommentDto extends PickType(CommentsModel, ['comment']) {}
