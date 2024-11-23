import { ApiProperty } from "@nestjs/swagger";

export class SearchRoomResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: [String] })
    images: string[];

    @ApiProperty()
    hotel: {
        id: string;
        title: string;
    };
}
