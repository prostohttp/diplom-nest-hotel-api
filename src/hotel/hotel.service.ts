import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ID } from "src/types";
import { IHotelService } from "./interfaces/hotel-service.interface";
import { Hotel, HotelDocument } from "./entities/hotel.entity";
import { SearchHotelParams } from "./interfaces/search-hotel-params.interface";
import { UpdateHotelParams } from "./interfaces/update-hotel-params.interface";
import { IHotel } from "./interfaces/hotel.interface";

@Injectable()
export class HotelService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<Hotel>) {}

  create(data: IHotel): Promise<HotelDocument> {
    try {
      const hotel = new this.hotelModel({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      if (hotel) {
        return hotel.save();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findByTitle(title: string): Promise<HotelDocument> {
    return this.hotelModel.findOne({ title });
  }

  findById(id: ID): Promise<HotelDocument> {
    throw new Error("Method not implemented.");
  }
  search(params: SearchHotelParams): Promise<HotelDocument[]> {
    throw new Error("Method not implemented.");
  }
  update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
    throw new Error("Method not implemented.");
  }
}
