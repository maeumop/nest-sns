import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/api/common/common.service';
import { UpdateCommentDto } from 'src/dto/blogs/update-comment.dto';
import { PaginateCommentDto } from 'src/dto/blogs/paginate-comment.dto';
import { CommentsModel } from 'src/entity/posts/comment.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UsersModel } from 'src/entity/users/user.entity';
import { COMMENT_DEFAULT_FIND_OPTIONS } from 'src/constant/blog.constant';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly repository: Repository<CommentsModel>,
    private readonly commonService: CommonService,
  ) {}

  getRepository(qr: QueryRunner) {
    return qr ? qr.manager.getRepository(CommentsModel) : this.repository;
  }

  async paginateComments(blogId: number, dto: PaginateCommentDto) {
    return await this.commonService.paginate<CommentsModel>(
      dto,
      this.repository,
      {
        where: {
          blog: {
            id: blogId,
          },
        },
        ...COMMENT_DEFAULT_FIND_OPTIONS,
      },
      `blogs/${blogId}/comments`,
    );
  }

  async commentById(id: number) {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      ...COMMENT_DEFAULT_FIND_OPTIONS,
    });

    if (!result) {
      throw new BadRequestException(`존재하지 않는 코멘트 입니다.[${id}]`);
    }

    return result;
  }

  async createComment(blogId: number, author: UsersModel, comment: string) {
    return this.repository.save({
      author,
      blog: {
        id: blogId,
      },
      comment,
    });
  }

  async updateComment(id: number, dto: UpdateCommentDto) {
    const comment = await this.repository.preload({
      id,
      ...dto,
    });

    if (!comment) {
      throw new BadRequestException('등록되지 않은 코멘트 입니다.');
    }

    // comment.comment = dto.comment ?? comment.comment;
    // comment.likeCount = dto.likeCount ?? comment.likeCount;

    const result = this.repository.save(comment);

    return result;
  }

  async deleteComment(id: number) {
    const comment = await this.repository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new BadRequestException(
        '이미 삭제되었거나 찾을 수 없는 코멘트입니다.',
      );
    }

    await this.repository.delete(id);

    return id;
  }

  async isMyComment(authorId: number, id: number) {
    return await this.repository.exists({
      where: {
        id,
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
