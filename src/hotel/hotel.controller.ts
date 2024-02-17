import { Controller, Get, Post, Put } from "@nestjs/common";
import { HotelService } from "./hotel.service";

@Controller("")
export class HotelController {
  constructor(private readonly hostelService: HotelService) {}

  @Get("common/hotel-rooms")
  async getHotelRooms() {
    return "Get Hotel rooms";
  }

  @Get("common/hotel-rooms/:id")
  async getHotelRoom() {
    return "Get Hotel room";
  }

  @Post("admin/hotels/")
  async addHotels() {
    return "Admin Add hotel";
  }

  @Get("admin/hotels/")
  async getHotels() {
    return "Admin Get hotel";
  }

  @Put("admin/hotels/:id")
  async changeHotel() {
    return "Change Hotel";
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
