import { ID } from "src/types/id";
import { ReservationDto } from "./reservation-dto.interface";
import { ReservationSearchOptions } from "./reservation-search-options.interface";
import { Reservation } from "../entities/reservation.entity";

export interface IReservation {
    addReservation(data: ReservationDto): Promise<Reservation>;
    removeReservation(id: ID): Promise<void>;
    getReservations(
        filter: ReservationSearchOptions,
    ): Promise<Array<Reservation>>;
}
