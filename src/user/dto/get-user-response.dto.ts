import { ApiProperty } from "@nestjs/swagger";

export class GetUserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    contactPhone: string;
}
