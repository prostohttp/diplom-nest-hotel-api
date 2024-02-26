import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IsUniqueTitle } from "../validators/is-unique-hotel.validator";

export class AddHotelParamsDto {
  @ApiProperty({ default: "Hotel 1" })
  @IsNotEmpty({ message: 'Поле "title" не должно быть пустым' })
  @IsUniqueTitle({ message: "Hotel c таким названием уже существует" })
  title: string;

  @IsNotEmpty({ message: 'Поле "description" не должно быть пустым' })
  @ApiProperty({ default: "Description 1" })
  description: string;
}
