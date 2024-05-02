import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_PATH } from 'src/common/path';
import { v4 as uuid } from 'uuid';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModel } from 'src/entity/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageModel]),
    // 파일 업로드 기본 설정
    MulterModule.register({
      limits: {
        // byte
        fileSize: 10000000,
      },
      fileFilter: (req, file, callback) => {
        const allowedfileExt = ['.jpg', '.jpeg', '.png', '.gif'];
        const ext = extname(file.originalname);

        if (!allowedfileExt.includes(ext)) {
          return callback(
            new BadRequestException('파일은 jpg, png, gif 파일만 가능합니다.'),
            false,
          );
        }

        return callback(null, true);
      },
      storage: multer.diskStorage({
        destination(req, res, callback) {
          callback(null, TEMP_PATH);
        },
        filename(req, file, callback) {
          callback(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
    // guard에 필요한 모듈 import
    AuthModule,
    UsersModule,
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
