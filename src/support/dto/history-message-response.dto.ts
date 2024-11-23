import { ApiProperty } from "@nestjs/swagger";

export class HistoryMessageResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    text: string;

    @ApiProperty()
    readAt: string;

    @ApiProperty()
    author: {
        id: string;
        name: string;
    };
}
