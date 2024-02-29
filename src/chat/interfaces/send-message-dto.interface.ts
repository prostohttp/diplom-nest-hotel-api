import { ID } from "src/types";

export interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}
