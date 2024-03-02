import { ID } from "src/types/id";

export interface CreateSupportRequestDto {
  user: ID;
  text: string;
}
