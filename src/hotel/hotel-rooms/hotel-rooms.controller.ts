import { Controller, Get, Post, Put } from "@nestjs/common";
import { HotelRoomsService } from "./hotel-rooms.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("API Модуля «Гостиницы»")
@Controller()
export class HotelRoomsController {
  constructor(private readonly hotelRooms: HotelRoomsService) {}

  @Get("common/hotel-rooms")
  async getHotelRooms() {
    return "Get hotel rooms";
  }

  @Get("common/hotel-rooms/:id")
  async getHotelRoom() {
    return "Get Hotel room";
  }

  @Post("admin/hotel-rooms/")
  async addHotelRoom() {
    return "Admin add hotel room";
  }

  @Put("admin/hotel-rooms/:id")
  async changeHotelRoom() {
    return "Change Hotel room";
  }
}
