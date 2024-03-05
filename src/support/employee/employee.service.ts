import { Injectable } from "@nestjs/common";
import { ISupportRequestEmployeeService } from "../interfaces/support-request-employee-service.interface";
import { ID } from "src/types/id";
import { MarkMessagesAsReadDto } from "../interfaces/mark-messages-as-read-dto.interface";

@Injectable()
export class SupportEmployeeService implements ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    throw new Error("Method not implemented.");
  }
  getUnreadCount(supportRequest: ID): Promise<number> {
    throw new Error("Method not implemented.");
  }
  closeRequest(supportRequest: ID): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
