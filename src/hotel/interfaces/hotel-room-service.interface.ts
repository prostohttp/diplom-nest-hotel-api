import { ID } from "src/types/id";
import { HotelRoom } from "../entities/hotel-room.entity";
import { SearchRoomsParams } from "./search-rooms-params.interface";

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
