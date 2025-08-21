// notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: {
    origin: '*'
}}) // enable CORS if frontend is separate
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Example: receive a message from client
  @SubscribeMessage('sendNotification')
  handleSendNotification(@MessageBody() data: { message: string }) {
    console.log('Notification received:', data);
    // Broadcast to all connected clients
    this.server.emit('receiveNotification', data);
  }

  // Send notification from backend (without client trigger)
  sendNotificationToAll(message: string) {
    this.server.emit('receiveNotification', { message });
  }
}
