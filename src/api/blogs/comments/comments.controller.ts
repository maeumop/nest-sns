import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginateCommentDto } from 'src/dto/blogs/paginate-comment.dto';
import { CreateCommentDto } from 'src/dto/blogs/create-comment.dto';
import { HttpExceptionFilter } from 'src/exception-filter/http.exception-filter';
import { UpdateCommentDto } from 'src/dto/blogs/update-comment.dto';
import { User } from 'src/decorator/users/users.decorator';
import { UsersModel } from 'src/entity/users/user.entity';
import { PublicAPI } from 'src/decorator/public-api.decorator';
import { RoleCommentGuard } from 'src/guard/roles-comment.guard';

@Controller('blogs/:blogId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @PublicAPI()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  async getComments(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Query() dto: PaginateCommentDto,
  ) {
    return await this.commentsService.paginateComments(blogId, dto);
  }

  @Get(':id')
  @PublicAPI()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.commentById(id);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async postComment(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body() dto: CreateCommentDto,
    @User() user: UsersModel,
  ) {
    return await this.commentsService.createComment(blogId, user, dto.comment);
  }

  @Patch(':id')
  @UseGuards(RoleCommentGuard)
  async patchComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return await this.commentsService.updateComment(id, dto);
  }

  @Delete(':id')
  @UseGuards(RoleCommentGuard)
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.deleteComment(id);
  }
}
