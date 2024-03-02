import { ID } from "src/types/id";

export interface GetChatListParams {
  user: ID | null;
  isActive: boolean;
}
