import { ApiProperty } from "@nestjs/swagger";
import { SearchUserParams } from "../interfaces/search-user-params.interface";

export class SearchUserDto implements SearchUserParams {
  @ApiProperty({ default: 1, required: false })
  limit: number;

  @ApiProperty({ default: 0, required: false })
  offset: number;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  contactPhone: string;
}
