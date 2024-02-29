import { ApiProperty } from "@nestjs/swagger";

export class AddHotelRoomParamsDto {
  @ApiProperty({ type: String, default: "65db5daa2f65467396335835" })
  hotelId: string;

  @ApiProperty({ type: String, default: "Some description 1" })
  description: string;
}
