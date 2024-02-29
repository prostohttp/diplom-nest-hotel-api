import { ApiProperty } from "@nestjs/swagger";
import { AddHotelRoomParamsDto } from "./add-hotel-room-params.dto";

export class UpdateHotelRoomParamsDto extends AddHotelRoomParamsDto {
  @ApiProperty({ type: String, default: "65db5daa2f65467396335835" })
  hotelId: string;

  @ApiProperty({ type: String, default: "Some description 1" })
  description: string;

  @ApiProperty({ type: Boolean, default: true })
  isEnabled: boolean;
}
