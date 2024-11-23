import { ApiProperty } from "@nestjs/swagger";

export class AddReservationResponseDto {
    @ApiProperty()
    startDate: string;

    @ApiProperty()
    endDate: string;

    @ApiProperty()
    hotelRoom: {
        description: string;
        images: string[];
    };

    @ApiProperty()
    hotel: {
        title: string;
        description: string;
    };
}
