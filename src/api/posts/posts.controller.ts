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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/guard/auth/bearer-token.guard';
import { User } from 'src/decorator/users/users.decorator';
import { CreatePostDto } from 'src/dto/posts/create-post.dto';
import { UpdatePostDto } from 'src/dto/posts/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postPost(@User('id') id: number, @Body() body: CreatePostDto) {
    return this.postsService.createPost(id, body);
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
}
