import { ApiProperty } from "@nestjs/swagger";
import { SearchHotelParams } from "../interfaces/search-hotel-params.interface";

export class SearchHotelParamsDto implements SearchHotelParams {
  @ApiProperty({ default: 1 })
  limit: number;

  @ApiProperty({ default: 0 })
  offset: number;

  @ApiProperty({ default: "hotel 1" })
  title: string;
}
