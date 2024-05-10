import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChatsModel } from 'src/entity/chats/chat.entity';
import { MessagesModel } from 'src/entity/chats/message.entity';
import { ImageModel } from 'src/entity/image.entity';
import { CommentsModel } from 'src/entity/blogs/comment.entity';
import { BlogsModel } from 'src/entity/blogs/blog.entity';
import { UsersModel } from 'src/entity/users/user.entity';
import { UserFollowModel } from 'src/entity/users/user-follow.entity';

export const typeOrmConfig = async (
  config: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_DATABASE'),
    // TypeORM에서 사용될 모든 테이블(Entity)를 등록
    entities: [
      BlogsModel,
      UsersModel,
      ImageModel,
      ChatsModel,
      MessagesModel,
      CommentsModel,
      UserFollowModel,
    ],
    synchronize: true,
  };
};
