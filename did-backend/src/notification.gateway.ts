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



export class NotificationsGateway
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



// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ cors: { origin: '*' } })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   // store socketId per user
//   private clients: Map<string, string> = new Map();

//   handleConnection(client: Socket) {
//     // Suppose the userId is passed in query param during connection
//     const userId = client.handshake.query.userId as string;
//     if (userId) {
//       this.clients.set(userId, client.id);
//       console.log(`✅ User ${userId} connected with socket ${client.id}`);
//     }
//   }

//   handleDisconnect(client: Socket) {
//     for (const [userId, socketId] of this.clients.entries()) {
//       if (socketId === client.id) {
//         this.clients.delete(userId);
//         console.log(`❌ User ${userId} disconnected`);
//         break;
//       }
//     }
//   }

//   // 👉 send to one specific user
//   sendMessageToUser(userId: string, message: string) {
//     const socketId = this.clients.get(userId);
//     if (socketId) {
//       this.server.to(socketId).emit('receiveMessage', { message });
//     }
//   }
// }



// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ cors: { origin: '*' } })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   // store socketId per user
//   private clients: Map<string, string> = new Map();

//   handleConnection(client: Socket) {
//     // Suppose the userId is passed in query param during connection
//     const userId = client.handshake.query.userId as string;
//     if (userId) {
//       this.clients.set(userId, client.id);
//       console.log(`✅ User ${userId} connected with socket ${client.id}`);
//     }
//   }

//   handleDisconnect(client: Socket) {
//     for (const [userId, socketId] of this.clients.entries()) {
//       if (socketId === client.id) {
//         this.clients.delete(userId);
//         console.log(`❌ User ${userId} disconnected`);
//         break;
//       }
//     }
//   }

//   // 👉 send to one specific user
//   sendMessageToUser(userId: string, message: string) {
//     const socketId = this.clients.get(userId);
//     if (socketId) {
//       this.server.to(socketId).emit('receiveMessage', { message });
//     }
//   }
// }


// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", {
//   query: { userId: "123" } // 👈 identify user
// });

// socket.on("receiveMessage", (data) => {
//   console.log("📩 Message for me:", data.message);
// });


// // example.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { ChatGateway } from './chat.gateway';

// @Controller('chat')
// export class ChatController {
//   constructor(private readonly chatGateway: ChatGateway) {}

//   @Post('send-to-user')
//   sendToUser(@Body() body: { userId: string; message: string }) {
//     this.chatGateway.sendMessageToUser(body.userId, body.message);
//     return { status: 'ok', sentTo: body.userId };
//   }
// }
