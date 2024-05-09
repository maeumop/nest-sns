import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './api/blogs/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { CommonModule } from './api/common/common.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './common/typeorm.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UPLOAD_PATH } from './common/path';
import { LogMiddleware } from './middleware/log.middleware';
import { ChatsModule } from './chats/chats.module';
import { CommentsModule } from './api/blogs/comments/comments.module';
import { RolesUserGuard } from './guard/roles-user.guard';
import { AccessTokenGuard } from './guard/bearer-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      cache: true,
      envFilePath: [
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => await typeOrmConfig(config),
    }),
    ServeStaticModule.forRoot({
      rootPath: UPLOAD_PATH,
      serveRoot: '/upload',
    }),
    BlogsModule,
    AuthModule,
    UsersModule,
    CommonModule,
    ChatsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Exclude 설정된 프로퍼티는 모두 불러 오지 않도록 설정
    // global 설정된 provide는 순차적으로 적용된다.
    {
      provide: APP_FILTER,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesUserGuard,
    },
  ],
})
export class AppModule implements NestModule {
  // request -> middleware -> guard -> interceptor -> pipe -> logics -> exception filter -> interceptor
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      path: '*', // 'posts*'
      method: RequestMethod.ALL,
    });
  }
}
