import { ApiProperty } from "@nestjs/swagger";
import { SearchRoomsParams } from "../interfaces/search-rooms-params.interface";

export class SearchRoomsParamsDto implements SearchRoomsParams {
  @ApiProperty({ default: 1 })
  limit: number;

  @ApiProperty({ default: 1 })
  offset: number;

  @ApiProperty({ default: "Hotel 1" })
  hotel: string;

  @ApiProperty({ default: true })
  isEnabled?: boolean;
}
