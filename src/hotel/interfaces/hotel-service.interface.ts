import { ID } from "src/types/id";
import { Hotel } from "../entities/hotel.entity";
import { SearchHotelParams } from "./search-hotel-params.interface";
import { UpdateHotelParams } from "./update-hotel-params.interface";

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}
