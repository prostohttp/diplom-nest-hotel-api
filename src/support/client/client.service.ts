import { Injectable } from "@nestjs/common";
import { ISupportRequestClientService } from "../interfaces/support-request-client-service.interface";
import { ID } from "src/types/id";
import { SupportRequest } from "../entities/support-request.entity";
import { CreateSupportRequestDto } from "../interfaces/create-support-request-dto.interface";
import { MarkMessagesAsReadDto } from "../interfaces/mark-messages-as-read-dto.interface";

@Injectable()
export class SupportClientService implements ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
    throw new Error("Method not implemented.");
  }
  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    throw new Error("Method not implemented.");
  }
  getUnreadCount(supportRequest: ID): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
