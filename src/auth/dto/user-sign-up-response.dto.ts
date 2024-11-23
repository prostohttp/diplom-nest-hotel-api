import { ApiProperty } from "@nestjs/swagger";

export class UserSignUpResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
}
