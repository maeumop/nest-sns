import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from '../../entity/posts/post.entity';
import { AuthModule } from 'src/api/auth/auth.module';
import { UsersModule } from 'src/api/users/users.module';

// 해당 모듈에 등록된 클래스는 IoC(Inversion of Control)에서 자동으로 주입한다.
// Guard 사용을 위해 AuthModule, UsersModule 두가지를 import 해준다.
@Module({
  imports: [TypeOrmModule.forFeature([PostsModel]), AuthModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
