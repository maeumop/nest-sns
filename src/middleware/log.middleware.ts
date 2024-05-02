import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'connect';

export class LogMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    console.log(
      `[REQ MID] ${req.method}: ${req.url} - ${new Date().toLocaleString('kr')}`,
    );

    // 미들웨어 실행후 필수
    next();
  }
}
