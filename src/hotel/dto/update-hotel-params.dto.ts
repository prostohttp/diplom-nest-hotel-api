import { ApiProperty } from "@nestjs/swagger";
import { UpdateHotelParams } from "../interfaces/update-hotel-params.interface";

export class UpdateHotelParamsDto implements UpdateHotelParams {
  @ApiProperty({ default: "Hotel 1" })
  title: string;

  @ApiProperty({ default: "Description 1" })
  description: string;
}
