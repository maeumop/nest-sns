import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { BlogsModel } from '../../entity/blogs/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from 'src/dto/blogs/create-blog.dto';
import { UpdateBlogDto } from 'src/dto/blogs/update-blog.dto';
import { PaginateBlogDto } from 'src/dto/blogs/paginate-blog.dto';
import { CommonService } from '../common/common.service';
import { ImageModel } from 'src/entity/image.entity';
import { BLOG_DEFAULT_FIND_OPTIONS } from 'src/constant/blog.constant';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogsModel)
    private readonly repository: Repository<BlogsModel>,
    private readonly commonService: CommonService,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(BlogsModel) : this.repository;
  }

  getAllBlogs() {
    return this.repository.find({
      ...BLOG_DEFAULT_FIND_OPTIONS,
    });
  }

  async getBlogById(id: number, qr?: QueryRunner) {
    const result = await this.getRepository(qr).findOne({
      ...BLOG_DEFAULT_FIND_OPTIONS,
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async createBlog(authorId: number, dto: CreateBlogDto, qr?: QueryRunner) {
    const repo = this.getRepository(qr);

    const blog = repo.create({
      author: {
        id: authorId,
      },
      ...dto,
      images: [],
      likeCount: 0,
      commentCount: 0,
    });

    const newBlog = await repo.save(blog);

    return newBlog;
  }

  async updateBlog(id: number, dto: UpdateBlogDto) {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    result.title = dto.title ?? result.title;
    result.content = dto.content ?? result.content;

    const newResult = await this.repository.save(result);

    return newResult;
  }

  async deleteBlog(id: number) {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    await this.repository.delete(id);

    return id;
  }

  async paginateBlogs(dto: PaginateBlogDto) {
    return this.commonService.paginate<BlogsModel>(
      dto,
      this.repository,
      BLOG_DEFAULT_FIND_OPTIONS,
      'blogs',
    );
  }

  async generateRandomBlogs(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createBlog(userId, {
        title: `일괄 처리되는 제목 ${i}`,
        content: `일괄 처리되는 게시물의 내용입니다.${i}`,
        images: [],
      });
    }
  }

  async blogExistsById(id: number) {
    return await this.repository.exists({
      where: {
        id,
      },
    });
  }

  async isMyBlog(authorId: number, blogId: number) {
    return await this.repository.exists({
      where: {
        id: blogId,
        author: {
          id: authorId,
        },
      },
      relations: {
        author: true,
      },
    });
  }
}
