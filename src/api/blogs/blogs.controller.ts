import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { User } from 'src/decorator/users/users.decorator';
import { CreateBlogDto } from 'src/dto/blogs/create-blog.dto';
import { UpdateBlogDto } from 'src/dto/blogs/update-blog.dto';
import { PaginateBlogDto } from 'src/dto/blogs/paginate-blog.dto';
import { UsersModel } from 'src/entity/users/user.entity';
import { ImageModelType } from 'src/types/common';
import { QueryRunner } from 'typeorm';
import { CommonService } from '../common/common.service';
import { LogInterceptor } from 'src/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/interceptor/transaction.interceptor';
import { QR } from 'src/decorator/query-runner.decorator';
import { HttpExceptionFilter } from 'src/exception-filter/http.exception-filter';
import { PublicAPI } from 'src/decorator/public-api.decorator';
import { RoleBlogGuard } from 'src/guard/roles-blog.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  @PublicAPI()
  @UseInterceptors(ClassSerializerInterceptor, LogInterceptor)
  @UseFilters(HttpExceptionFilter)
  getAllBlogs(@Query() query: PaginateBlogDto) {
    return this.blogsService.paginateBlogs(query);
  }

  @Get(':id')
  @PublicAPI()
  @UseInterceptors(ClassSerializerInterceptor, LogInterceptor)
  getBlog(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.getBlogById(id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postBlog(
    @User('id') id: number,
    @Body() dto: CreateBlogDto,
    @QR() qr: QueryRunner,
  ) {
    const blog = await this.blogsService.createBlog(id, dto, qr);

    for (let i = 0; i < dto.images.length; i++) {
      await this.commonService.createImage(
        {
          blog,
          order: i,
          path: dto.images[i],
          type: ImageModelType.POST,
        },
        qr,
      );
    }

    return this.blogsService.getBlogById(blog.id, qr);
  }

  // 부분적인 update를 할때는 Patch 메서드 사용
  // Put 모든 값을 입력 받아야 하고, 동일한 내용이 있는 경우 업데이트, 없는 경우 데이터 생성이 주목적
  // RBAC (Role Based Access Control -> 역할 기반 접근 제어)
  @Patch(':id')
  @UseGuards(RoleBlogGuard)
  patchBlogById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBlogDto,
  ) {
    return this.blogsService.updateBlog(id, body);
  }

  // RBAC - 사용 권한 role 설정
  @Delete(':id')
  @UseGuards(RoleBlogGuard)
  // @Roles(UserRole.ADMIN)
  deleteBlogById(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.deleteBlog(id);
  }

  @Post('random')
  async postRandomArticles(@User() user: UsersModel) {
    await this.blogsService.generateRandomBlogs(user.id);
    return true;
  }
}
