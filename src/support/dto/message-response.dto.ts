import { ApiProperty } from "@nestjs/swagger";
import { CreateMessageRequestDto } from "./create-message-request.dto";

export class MessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  hasNewMessages: boolean;

  @ApiProperty()
  client: {
    id: string;
    name: string;
    email: string;
    contactPhone: string;
  };
}
