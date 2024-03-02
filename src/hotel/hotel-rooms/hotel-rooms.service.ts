import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HotelRoomService } from "../interfaces/hotel-room-service.interface";
import { ID } from "src/types/id";
import { HotelRoom, HotelRoomDocument } from "../entities/hotel-room.entity";
import { SearchRoomsParams } from "../interfaces/search-rooms-params.interface";

@Injectable()
export class HotelRoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoom>,
  ) {}

  create(data: Partial<HotelRoomDocument>): Promise<HotelRoomDocument> {
    const room = new this.HotelRoomModel({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEnabled: true,
    });

    return room.save();
  }

  findById(id: ID): Promise<HotelRoomDocument> {
    return this.HotelRoomModel.findOne({ _id: id });
  }

  search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    const { limit, offset, hotel, isEnabled = undefined } = params;
    if (isEnabled === undefined) {
      return this.HotelRoomModel.find({ hotel }).limit(limit).skip(offset);
    }
    return this.HotelRoomModel.find({ hotel, isEnabled })
      .limit(limit)
      .skip(offset);
  }

  async update(
    id: ID,
    data: Partial<HotelRoomDocument>,
  ): Promise<HotelRoomDocument> {
    return this.HotelRoomModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
  }
}
