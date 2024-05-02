import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { basename, join } from 'path';
import { POST_UPLOAD_PATH, TEMP_PATH } from 'src/common/path';
import { BasePaginateDto } from 'src/dto/base-paginate.dto';
import { CreatePostImageDto } from 'src/dto/create-image.dto';
import { BaseModel } from 'src/entity/base.entity';
import { ImageModel } from 'src/entity/image.entity';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  LessThan,
  MoreThan,
  QueryRunner,
  Repository,
} from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository?: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(ImageModel) : this.imageRepository;
  }

  async createImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const tempImagePath = join(TEMP_PATH, dto.path);

    try {
      await promises.access(tempImagePath);
    } catch (e) {
      throw new BadRequestException('존재하지 않는 파일 입니다.');
    }

    const fileName = basename(tempImagePath);
    const savePath = join(POST_UPLOAD_PATH, fileName);

    const result = await this.getRepository(qr).save({ ...dto });

    await promises.rename(tempImagePath, savePath);

    return result;
  }

  async paginate<T extends BaseModel>(
    dto: BasePaginateDto<T>,
    repository: Repository<T>,
    overrideOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    let options: FindManyOptions<T> = {};
    const where: FindOptionsWhere<T> = {};
    const order: FindOptionsOrder<T> = {};
    let skip: number;

    if (dto.order && dto.orderField) {
      order[dto.orderField.toString()] = dto.order;
    }

    if (dto.page) {
      skip = dto.page > 1 ? dto.take * (dto.page - 1) : 0;
    }

    if (dto.lastId && !dto.page) {
      where.id = (
        dto.order === 'ASC' ? MoreThan(dto.lastId) : LessThan(dto.lastId)
      ) as FindOptionsWhereProperty<T['id'], T['id']>;
    }

    options = {
      where,
      order,
      take: dto.take,
      skip,
      ...overrideOptions,
    };

    const [posts, total] = await repository.findAndCount(options);

    let lastRecord;
    let nextUrl;

    if (!dto.page) {
      const { HTTP_HOST, HTTP_PROTOCOL } = process.env;

      lastRecord =
        posts.length && posts.length === dto.take
          ? posts[posts.length - 1]
          : null;

      if (lastRecord) {
        nextUrl = new URL(`${HTTP_PROTOCOL}://${HTTP_HOST}/${path}`);
      }

      if (nextUrl) {
        for (const key of Object.keys(dto)) {
          if (dto[key]) {
            nextUrl.searchParams.append(key, dto[key]);
          }

          if (lastRecord && !nextUrl.searchParams.has('lastId')) {
            nextUrl.searchParams.append('lastId', lastRecord.id.toString());
          }
        }
      }
    }

    return {
      data: posts,
      cursor: {
        after: lastRecord && lastRecord.id,
      },
      count: posts.length,
      total,
      next: nextUrl?.toString() ?? null,
    };
  }
}
