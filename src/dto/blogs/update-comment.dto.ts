import { PartialType } from '@nestjs/mapped-types';
import { CommentsModel } from 'src/entity/posts/comment.entity';

export class UpdateCommentDto extends PartialType(CommentsModel) {}
