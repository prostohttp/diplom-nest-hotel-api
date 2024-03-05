import { ApiProperty } from "@nestjs/swagger";

export class AddRoomResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty()
  hotel: {
    id: string;
    title: string;
    description: string;
  };
}
