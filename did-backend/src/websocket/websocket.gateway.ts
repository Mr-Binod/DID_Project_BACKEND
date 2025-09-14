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

@WebSocketGateway({
  cors: {
    origin: ["https://sealiumback.store", "http://localhost:3000"], // or "*" while testing
    methods: ["GET", "POST"],
    credentials: true,
  },
})

export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log('client', client);
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

  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() data: {message : string, userId : string}){
    console.log('Message received:', data);
    if(data.userId){
    this.server.to(data.userId).emit('receiveMessage', data);
    }
    else{
      this.server.emit('receiveMessage', data);
    }
  }
  // Send notification from backend (without client trigger)
  sendNotificationToAll(message: string) {
    this.server.emit('receiveNotification', { message });
  }
}


