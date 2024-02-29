import { ID } from "src/types";
import { MarkMessagesAsReadDto } from "./mark-messages-as-read-dto.interface";

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}
