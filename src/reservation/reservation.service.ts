import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IReservation } from "./interfaces/reservation.interface";
import { ID } from "src/types/id";
import { Reservation } from "./entities/reservation.entity";
import { ReservationDto } from "./interfaces/reservation-dto.interface";
import { ReservationSearchOptions } from "./interfaces/reservation-search-options.interface";

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name) private ReservationModel: Model<Reservation>,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    const { userId, hotelId, roomId, dateStart, dateEnd } = data;
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
