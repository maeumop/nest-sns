import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from 'src/dto/chats/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from 'src/dto/chats/enter-chat.dto';
import { CreateMessageDto } from 'src/dto/chats/create-message.dto';
import { MessagesService } from './messages/messages.service';
import { UseFilters, UsePipes } from '@nestjs/common';
import { globalValidationPipe } from 'src/pipe/global-validation.pipe';
import { WsCatchHttpExceptionFilter } from 'src/exception-filter/ws-catch-http.exception-filter';
import { UsersModel } from 'src/entity/users/user.entity';
import { UsersService } from 'src/api/users/users.service';
import { AuthService } from 'src/api/auth/auth.service';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket & { user: UsersModel }) {
    console.log(`on connect: ${socket.id}`);

    const rawToken = socket.handshake.headers['authorization'];

    if (!rawToken) {
      socket.disconnect();
      throw new WsException('토큰이 없습니다(Bearer)');
    }

    try {
      const token = this.authService.getTokenString(rawToken, true);
      const result = await this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(result.email);

      socket.user = user;

      return true;
    } catch (e) {
      socket.disconnect();
      throw new WsException('유효하지 않은 토큰 입니다.');
    }
  }

  afterInit(server: any) {
    console.log(`after gateway init ${server}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`after disconnected ${socket.id}`);
  }

  /**
   * socket 관련 pipe는 main.ts에서 useGlobalPipe 적용에 영향을 받지 않음
   * 각각의 함수에 따로 적용해줘야 한다.
   * NestJS는 Web API 전용으로 제작됨
   */
  @UsePipes(globalValidationPipe)
  @UseFilters(WsCatchHttpExceptionFilter)
  @SubscribeMessage('create_room')
  async createChatRoom(
    @MessageBody() body: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    return await this.chatsService.createChat(body);
  }

  @UsePipes(globalValidationPipe)
  @UseFilters(WsCatchHttpExceptionFilter)
  @SubscribeMessage('enter_room')
  async enterChatRoom(
    @MessageBody() dto: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    for (let i = 0; i < dto.chatIds.length; i++) {
      const chatId = dto.chatIds[i];
      const result = await this.chatsService.isExistsChatRoom(chatId);

      if (!result) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 채팅방입니다.`,
          chatId,
        });
      }
    }

    socket.join(dto.chatIds.map((v) => v.toString()));
  }

  @UsePipes(globalValidationPipe)
  @UseFilters(WsCatchHttpExceptionFilter)
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const exists = await this.chatsService.isExistsChatRoom(dto.chatId);

    if (exists) {
      const msg = await this.messagesService.createMessage(dto, socket.user.id);

      // broadcasting 나를 제외한 방에 메시지 전송
      socket.to(dto.chatId.toString()).emit('receive_message', msg.message);
      // 전체에 보내는 메시지
      // this.server
      //   .in(body.chatId.toString())
      //   .emit('receive_message', body.message);
    } else {
      throw new WsException({
        code: 100,
        message: '존재하지 않는 채팅방입니다.',
        chatId: dto.chatId,
      });
    }
  }
}
