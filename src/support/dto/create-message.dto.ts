import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
  @ApiProperty({ default: "Первое сообщение" })
  text: string;
}
