import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { Reservation, ReservationSchema } from "./entities/reservation.entity";
import { User, UserSchema } from "src/user/entities/user.entity";
import { Hotel, HotelSchema } from "src/hotel/entities/hotel.entity";
import {
  HotelRoom,
  HotelRoomSchema,
} from "src/hotel/entities/hotel-room.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: User.name, schema: UserSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
