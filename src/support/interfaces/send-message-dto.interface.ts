import { ID } from "src/types/id";

export interface SendMessageDto {
    author: ID;
    supportRequest: ID;
    text: string;
}
