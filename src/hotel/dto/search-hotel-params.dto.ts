import { ApiProperty } from "@nestjs/swagger";
import { SearchHotelParams } from "../interfaces/search-hotel-params.interface";

export class SearchHotelParamsDto implements SearchHotelParams {
    @ApiProperty({ required: false })
    limit: number;

    @ApiProperty({ required: false })
    offset: number;

    @ApiProperty({ default: "hotel 1", required: false })
    title: string;
}
