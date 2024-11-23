import { ApiProperty } from "@nestjs/swagger";

export class SearchRoomsParamsDto {
    @ApiProperty({ default: 100 })
    limit: number;

    @ApiProperty({ default: 0 })
    offset: number;

    @ApiProperty({ default: "Hotel Id", required: true })
    hotel: string;

    @ApiProperty({ default: true, required: false })
    isEnabled?: boolean;
}
