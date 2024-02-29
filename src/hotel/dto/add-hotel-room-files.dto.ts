import { ApiProperty } from "@nestjs/swagger";

export class AddHotelRoomParamsDto {
  @ApiProperty({ type: [File] })
  images: File[];
}
