import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModel } from '../../entity/posts/blog.entity';
import { AuthModule } from 'src/api/auth/auth.module';
import { UsersModule } from 'src/api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { ImageModel } from 'src/entity/image.entity';
import { CommonService } from '../common/common.service';

// 해당 모듈에 등록된 클래스는 IoC(Inversion of Control)에서 자동으로 주입한다.
// Guard 사용을 위해 AuthModule, UsersModule 두가지를 import 해준다.
@Module({
  imports: [
    TypeOrmModule.forFeature([BlogsModel, ImageModel]),
    AuthModule,
    UsersModule,
    ConfigModule,
    CommonModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, CommonService],
  exports: [BlogsService],
})
export class BlogsModule {}
