import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BlogCommentService } from './blog-comment.service';
import { Server, Socket } from 'socket.io';
import { cors } from 'configs/cors';
import { CreateCommentDto } from './dto/create.dto';

@WebSocketGateway({
  cors: {
    origin: cors,
  },
})
export class BlogCommentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly blogCommentService: BlogCommentService) {}
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendComment')
  async handleEvent(@MessageBody() data: CreateCommentDto) {
    const result = await this.blogCommentService.createComment(data);

    this.server.emit(`comment-${result?.slug}`, {
      action: 'refresh',
    });
  }
}
