import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  ParseIntPipe,
  UseGuards,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseFilters,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/guard/auth/bearer-token.guard';
import { User } from 'src/decorator/users/users.decorator';
import { CreatePostDto } from 'src/dto/posts/create-post.dto';
import { UpdatePostDto } from 'src/dto/posts/update-post.dto';
import { PaginatePostDto } from 'src/dto/posts/paginate-post.dto';
import { UsersModel } from 'src/entity/users/users.entity';
import { ImageModelType } from 'src/types/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CommonService } from '../common/common.service';
import { LogInterceptor } from 'src/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/interceptor/transaction.interceptor';
import { QR } from 'src/decorator/query-runner.decorator';
import { HttpExceptionFilter } from 'src/exception-filter/http.exception-filter';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor, LogInterceptor)
  @UseFilters(HttpExceptionFilter)
  getAllPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor, LogInterceptor)
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postPost(
    @User('id') id: number,
    @Body() body: CreatePostDto,
    @QR() qr: QueryRunner,
  ) {
    const post = await this.postsService.createPost(id, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.commonService.createImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST,
        },
        qr,
      );
    }

    return this.postsService.getPostById(post.id, qr);
  }

  // 부분적인 update를 할때는 Patch 메서드 사용
  // Put 모든 값을 입력 받아야 하고, 동일한 내용이 있는 경우 업데이트, 없는 경우 데이터 생성이 주목적
  @Patch(':id')
  patchPostById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  deletePostById(@Body('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postRandomArticles(@User() user: UsersModel) {
    await this.postsService.generateRandomPosts(user.id);
    return true;
  }
}
