import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HotelRoomsService } from "./hotel-rooms.service";
import { HotelRoomsController } from "./hotel-rooms.controller";
import { HotelRoom, HotelRoomSchema } from "../entities/hotel-room.entity";
import { Hotel, HotelSchema } from "../entities/hotel.entity";
import { HotelService } from "../hotel.service";
import { IsValidMongoIdConstraint } from "src/validators/is-valid-mongo-id.validator";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [HotelRoomsController],
  providers: [HotelRoomsService, HotelService, IsValidMongoIdConstraint],
})
export class HotelRoomsModule {}
