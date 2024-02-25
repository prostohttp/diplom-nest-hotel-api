import { ApiProperty } from "@nestjs/swagger";
import { IHotel } from "../interfaces/hotel.interface";
import { IsNotEmpty } from "class-validator";
import { IsUniqueTitle } from "../validators/is-unique-hotel.validator";

export class HotelDto implements IHotel {
  @ApiProperty({ default: "hotel 1" })
  @IsNotEmpty({ message: 'Поле "title" не должно быть пустым' })
  @IsUniqueTitle({ message: "Hotel c таким названием уже существует" })
  title: string;

  @IsNotEmpty({ message: 'Поле "description" не должно быть пустым' })
  @ApiProperty({ default: "hotel 1 description" })
  description: string;
}
