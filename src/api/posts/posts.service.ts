import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { PostsModel } from '../../entity/posts/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/dto/posts/create-post.dto';
import { UpdatePostDto } from 'src/dto/posts/update-post.dto';
import { PaginatePostDto } from 'src/dto/posts/paginate-post.dto';
import { CommonService } from '../common/common.service';
import { ImageModel } from 'src/entity/image.entity';
import { POST_DEFAULT_FIND_OPTIONS } from 'src/constant/post.constant';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(PostsModel) : this.postsRepository;
  }

  getAllPosts() {
    return this.postsRepository.find({
      ...POST_DEFAULT_FIND_OPTIONS,
    });
  }

  async getPostById(id: number, qr?: QueryRunner) {
    const result = await this.getRepository(qr).findOne({
      ...POST_DEFAULT_FIND_OPTIONS,
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async createPost(authorId: number, dto: CreatePostDto, qr?: QueryRunner) {
    const repo = this.getRepository(qr);

    const post = repo.create({
      author: {
        id: authorId,
      },
      ...dto,
      images: [],
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await repo.save(post);

    return newPost;
  }

  async updatePost(id: number, dto: UpdatePostDto) {
    const result = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    result.title = dto.title ?? result.title;
    result.content = dto.content ?? result.content;

    const newResult = await this.postsRepository.save(result);

    return newResult;
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(id);

    return id;
  }

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginateOptions<PostsModel>(
      dto,
      this.postsRepository,
      POST_DEFAULT_FIND_OPTIONS,
      'posts',
    );
  }

  async generateRandomPosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `일괄 처리되는 제목 ${i}`,
        content: `일괄 처리되는 게시물의 내용입니다.${i}`,
        images: [],
      });
    }
  }
}
