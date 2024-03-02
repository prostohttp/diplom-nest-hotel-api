import { ID } from "src/types/id";

export interface ReservationSearchOptions {
  userId: ID;
  dateStart: Date;
  dateEnd: Date;
}
