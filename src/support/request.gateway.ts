import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { SupportRequestService } from "./request.service";
import { Server } from "socket.io";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsManagerOrClient } from "src/guards/is-manager-or-client.guard";
import {
  BadGatewayException,
  ForbiddenException,
  NotFoundException,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { UserRoles } from "src/types/user-roles";
import { InjectModel } from "@nestjs/mongoose";
import { SupportRequest } from "./entities/support-request.entity";
import { Model } from "mongoose";
import { Message } from "./entities/message.entity";
import { ParseMongoIdPipe } from "src/pipes/parse-mongo-id.pipe";

@WebSocketGateway()
export class SupportGateway {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly userService: UserService,
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(IsAuthenticatedGuard, IsManagerOrClient)
  @SubscribeMessage("subscribeToChat")
  async handleSubscribeToChat(
    @MessageBody("chatId", ParseMongoIdPipe) chatId: string,
    @Req() request: Request,
  ) {
    try {
      const user = request.user as User;
      const client = await this.userService.findByEmail(user.email);
      const supportRequest = await this.supportRequestModel.findById(chatId);
      if (!supportRequest) {
        throw new NotFoundException("Такого обращения нет");
      }
      if (
        user.role === UserRoles.Client &&
        client._id.toString() !== supportRequest.user.toString()
      ) {
        throw new ForbiddenException("У вас нет доступа к этому обращению");
      }

      // Создаем подписку на новые сообщения в чате
      const unsubscribe = this.supportRequestService.subscribe(
        async (supportRequest: SupportRequest, message: Message) => {
          const author = await this.userService.findById(message.author);
          const messageData = {
            id: message["_id"].toString(),
            createdAt: message.sentAt,
            text: message.text,
            readAt: message.readAt ? message.readAt : null,
            author: {
              id: author._id,
              name: author.name,
            },
          };
          this.server.emit("chatMessage", messageData);
        },
      );

      // Возвращаем функцию для отмены подписки
      return unsubscribe;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
