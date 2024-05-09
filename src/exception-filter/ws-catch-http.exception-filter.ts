import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class WsCatchHttpExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // super.catch 실행 하게 되면 WS Exception 에러가 2번 전송된다.
    // super.catch(exception, host);

    const socket = host.switchToWs().getClient();

    socket.emit('exception', exception.getResponse());
  }
}
