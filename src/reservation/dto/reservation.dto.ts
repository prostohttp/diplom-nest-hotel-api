import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, validateOrReject } from "class-validator";
import { IsValidMongoId } from "src/validators/is-valid-mongo-id.validator";

export class ReservationDto {
    @ApiProperty({ default: "65de087272633e8bff6a5afd" })
    @IsValidMongoId()
    hotelRoom: string;

    @ApiProperty({
        default: "2009-02-29",
        description: "Формат даты YYYY-MM-DD",
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        default: "2009-03-29",
        description: "Формат даты YYYY-MM-DD",
    })
    @IsDateString()
    endDate: string;

    async isValidEndDate(): Promise<void> {
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);

        if (startDate >= endDate) {
            throw new BadRequestException(
                "Дата окончания не может быть раньше даты начала",
            );
        }

        await validateOrReject(this);
    }
}
