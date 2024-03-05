import { ApiProperty } from "@nestjs/swagger";

export class CreateUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contactPhone: string;

  @ApiProperty()
  role: string;
}
