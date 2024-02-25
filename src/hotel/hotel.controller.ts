import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { ApiTags } from "@nestjs/swagger";
import { HotelDto } from "./dto/hotel.dto";
import { HotelDocument } from "./entities/hotel.entity";

@ApiTags("API Модуля «Гостиницы»")
@Controller()
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @UsePipes(ValidationPipe)
  @Post("admin/hotels/")
  async addHotels(@Body() data: HotelDto): Promise<Partial<HotelDocument>> {
    const hotel = await this.hotelService.create(data);
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Get("admin/hotels/")
  async getHotels() {
    return "Admin Get hotels";
  }

  @Put("admin/hotels/:id")
  async changeHotel() {
    return "Change Hotel";
  }
}
