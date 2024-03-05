import { ApiProperty } from "@nestjs/swagger";

export class RoomInfoResponseDto {
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
    description: string;
  };
}
