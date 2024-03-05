import { ApiProperty } from "@nestjs/swagger";

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
