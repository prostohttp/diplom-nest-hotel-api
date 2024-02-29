import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IReservation } from "./interfaces/reservation.interface";
import { ID } from "src/types";
import { Reservation } from "./entities/reservation.entity";
import { User } from "src/user/entities/user.entity";
import { ReservationDto } from "./interfaces/reservation-dto.interface";
import { ReservationSearchOptions } from "./interfaces/reservation-search-options.interface";
import { Hotel } from "src/hotel/entities/hotel.entity";
import { HotelRoom } from "src/hotel/entities/hotel-room.entity";

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name) private ReservationModel: Model<Reservation>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Hotel.name) private HotelModel: Model<Hotel>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoom>,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    const { userId, hotelId, roomId, dateStart, dateEnd } = data;

    const user = await this.UserModel.findById({ _id: userId });
    const hotel = await this.HotelModel.findById({ _id: hotelId });
    const room = await this.HotelRoomModel.findById({ _id: roomId });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    if (!hotel) {
      throw new NotFoundException("Гостиница не найдена");
    }
    if (!room) {
      throw new NotFoundException("Номер не найден");
    }

    return this.ReservationModel.create({
      userId,
      hotelId,
      roomId,
      dateStart,
      dateEnd,
    });
  }

  removeReservation(id: ID): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getReservations(filter: ReservationSearchOptions): Promise<Reservation[]> {
    throw new Error("Method not implemented.");
  }
}
