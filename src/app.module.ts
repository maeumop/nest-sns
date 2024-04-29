import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './api/posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entity/posts/post.entity';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { UsersModel } from './entity/users/users.entity';
import { CommonModule } from './api/common/common.module';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'unistyle',
      password: 'whddbs0455',
      database: 'sns',
      entities: [PostsModel, UsersModel],
      synchronize: true, // deloy 시에는 false로 설정되도록 할 필요가 있음,
    }),
    PostsModule,
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Exclude 설정된 프로퍼티는 모두 불러 오지 않도록 설정
    {
      provide: APP_FILTER,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
