import { ApiProperty } from "@nestjs/swagger";

export class IsReadMessageResponseDto {
  @ApiProperty({ default: "Первое сообщение" })
  success: string;
}
