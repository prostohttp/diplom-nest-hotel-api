import { ApiProperty } from "@nestjs/swagger";

export class AddHotelResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
