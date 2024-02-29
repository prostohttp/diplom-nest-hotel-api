import { ApiProperty } from "@nestjs/swagger";
import { SearchRoomsParams } from "../interfaces/search-rooms-params.interface";

export class SearchRoomsParamsDto implements SearchRoomsParams {
  @ApiProperty({ default: 1 })
  limit: number;

  @ApiProperty({ default: 1 })
  offset: number;

  @ApiProperty({ default: "Hotel 1", required: true })
  hotel: string;

  @ApiProperty({ default: true, required: false })
  isEnabled?: boolean;
}
