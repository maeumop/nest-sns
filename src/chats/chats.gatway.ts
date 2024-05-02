import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from 'src/dto/chats/create-chat.dto';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`on connect: ${client.id}`);
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() body: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatsService.createChat(body);
  }

  @SubscribeMessage('enter_room')
  enterChat(@MessageBody() data: number[], @ConnectedSocket() socket: Socket) {
    for (const chatId of data) {
      socket.join(chatId.toString());
    }
  }

  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() body: { message: string; chatId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(body);
    // broadcasting 나를 제외한 방에 메시지 전송
    socket.to(body.chatId.toString()).emit('receive_message', body.message);
    // 전체에 보내는 메시지
    // this.server
    //   .in(body.chatId.toString())
    //   .emit('receive_message', body.message);
  }
}
