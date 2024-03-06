import { ApiProperty } from "@nestjs/swagger";

export class UserSignInResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contactPhone: string;
}
