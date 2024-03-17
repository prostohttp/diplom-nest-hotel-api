import { ApiProperty } from "@nestjs/swagger";
import { AddHotelRoomParamsDto } from "./add-hotel-room-params.dto";
import { IsValidMongoId } from "src/validators/is-valid-mongo-id.validator";

export class UpdateHotelRoomParamsDto extends AddHotelRoomParamsDto {
  @ApiProperty({ type: String, default: "65db5daa2f65467396335835" })
  @IsValidMongoId()
  hotelId: string;

  @ApiProperty({ type: String, default: "Some description 1" })
  description: string;

  @ApiProperty({ type: Boolean, default: true })
  isEnabled: boolean;
}
