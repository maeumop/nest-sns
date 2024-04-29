import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from '../../entity/posts/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/dto/posts/create-post.dto';
import { UpdatePostDto } from 'src/dto/posts/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  async getPostById(id: number) {
    const result = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async createPost(authorId: number, dto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...dto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

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
}
