import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    const hotel = new this.hotelModel({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (hotel) {
      return hotel.save();
    } else {
      throw new BadRequestException();
    }
  }

  findByTitle(title: string): Promise<HotelDocument> {
    return this.hotelModel.findOne({ title });
  }

  findById(id: ID): Promise<HotelDocument> {
    return this.hotelModel.findOne({ _id: id });
  }

  search(params: SearchHotelParams): Promise<HotelDocument[]> {
    const { title = "", limit, offset } = params;
    return this.hotelModel
      .find({
        title: { $regex: title, $options: "i" },
      })
      .skip(offset)
      .limit(limit);
  }

  update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
    const hotel = this.findById(id);
    if (hotel) {
      return this.hotelModel.findOneAndUpdate(
        { _id: id },
        { ...data, updatedAt: new Date() },
        {
          new: true,
        },
      );
    } else {
      throw new NotFoundException();
    }
  }
}
