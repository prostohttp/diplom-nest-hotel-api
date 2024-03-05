import { ID } from "src/types/id";
import { SupportRequest } from "../entities/support-request.entity";
import { CreateSupportRequestDto } from "./create-support-request-dto.interface";
import { MarkMessagesAsReadDto } from "./mark-messages-as-read-dto.interface";

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<number>;
}
