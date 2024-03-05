import { ApiProperty } from "@nestjs/swagger";

export class IsCreatedMessageRequestDto {
  @ApiProperty({ default: "Первое обращение" })
  createdBefore?: string;
}
