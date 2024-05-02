import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChatsModel } from 'src/entity/chats/chat.entity';
import { ImageModel } from 'src/entity/image.entity';
import { PostsModel } from 'src/entity/posts/post.entity';
import { UsersModel } from 'src/entity/users/users.entity';

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
    entities: [PostsModel, UsersModel, ImageModel, ChatsModel],
    synchronize: true,
  };
};
