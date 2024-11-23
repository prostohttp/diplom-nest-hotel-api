import { Module } from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { HotelController } from "./hotel.controller";
import { HotelRoomsModule } from "./hotel-rooms/hotel-rooms.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "./entities/hotel.entity";
import { IsUniqueTitleConstraint } from "./validators/is-unique-hotel.validator";

@Module({
    imports: [
        HotelRoomsModule,
        MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    ],
    controllers: [HotelController],
    providers: [HotelService, IsUniqueTitleConstraint],
})
export class HotelModule {}
