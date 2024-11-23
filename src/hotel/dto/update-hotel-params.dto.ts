import { ApiProperty } from "@nestjs/swagger";
import { UpdateHotelParams } from "../interfaces/update-hotel-params.interface";
import { IsUniqueTitle } from "../validators/is-unique-hotel.validator";

export class UpdateHotelParamsDto implements UpdateHotelParams {
    @ApiProperty({ default: "Hotel 1" })
    @IsUniqueTitle({ message: "Hotel c таким названием уже существует" })
    title: string;

    @ApiProperty({ default: "Description 1" })
    description: string;
}
