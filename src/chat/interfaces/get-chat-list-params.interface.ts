import { ID } from "src/types";

export interface GetChatListParams {
  user: ID | null;
  isActive: boolean;
}
