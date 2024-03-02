import { ID } from "src/types/id";
import { Message } from "../entities/message.entity";
import { SupportRequest } from "../entities/support-request.entity";
import { GetChatListParams } from "./get-chat-list-params.interface";
import { SendMessageDto } from "./send-message-dto.interface";

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}
