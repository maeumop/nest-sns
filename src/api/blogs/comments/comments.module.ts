import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from 'src/entity/blogs/comment.entity';
import { CommonModule } from 'src/api/common/common.module';
import { AuthModule } from 'src/api/auth/auth.module';
import { UsersModule } from 'src/api/users/users.module';
import { BlogExistsMiddleware } from 'src/middleware/blog-exists.middleware';
import { BlogsModule } from '../blogs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsModel]),
    CommonModule,
    UsersModule,
    AuthModule,
    BlogsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlogExistsMiddleware).forRoutes(CommentsController);
  }
}
