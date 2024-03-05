import { Injectable } from "@nestjs/common";
import { ISupportRequestService } from "./interfaces/support-request-service.interface";
import { ID } from "src/types/id";
import { Message } from "./entities/message.entity";
import { SupportRequest } from "./entities/support-request.entity";
import { GetChatListParams } from "./interfaces/get-chat-list-params.interface";
import { SendMessageDto } from "./interfaces/send-message-dto.interface";

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
    throw new Error("Method not implemented.");
  }
  sendMessage(data: SendMessageDto): Promise<Message> {
    throw new Error("Method not implemented.");
  }
  getMessages(supportRequest: ID): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    throw new Error("Method not implemented.");
  }
}
