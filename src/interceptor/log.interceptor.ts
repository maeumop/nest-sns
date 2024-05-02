import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;
    const now = new Date();

    console.log(`[REQ] ${path} ==== ${now.toLocaleString('kr')}`);

    // next.handle을 실행 하면 라우트의 로직이 실행 되고 응답이 반환된다(observable).
    return next.handle().pipe(
      tap((observable) => {
        const end = new Date();

        console.log(
          `[RES] ${path} ==== ${end.toLocaleString('kr')}, ${end.getMilliseconds() - now.getMilliseconds()}ms`,
        );
      }), // -> 모니터링
      map((observable) => ({
        // -> 변경
        message: '응답이 변경되었습니다.',
        response: observable,
      })),
    );
  }
}
