import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from '../../entity/posts/post.entity';
import { AuthModule } from 'src/api/auth/auth.module';
import { UsersModule } from 'src/api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { ImageModel } from 'src/entity/image.entity';
import { CommonService } from '../common/common.service';
import { LogMiddleware } from 'src/middleware/log.middleware';

// 해당 모듈에 등록된 클래스는 IoC(Inversion of Control)에서 자동으로 주입한다.
// Guard 사용을 위해 AuthModule, UsersModule 두가지를 import 해준다.
@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel, ImageModel]),
    AuthModule,
    UsersModule,
    ConfigModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, CommonService],
})
export class PostsModule {}
