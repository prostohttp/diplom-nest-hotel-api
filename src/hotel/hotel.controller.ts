import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import { HotelService } from "./hotel.service";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { HotelDocument } from "./entities/hotel.entity";
import { ID } from "src/types/id";
import { UpdateHotelParamsDto } from "./dto/update-hotel-params.dto";
import { AddHotelParamsDto } from "./dto/add-hotel-params.dto";
import { SearchHotelParamsDto } from "./dto/search-hotel-params.dto";

@ApiTags("API Модуля «Гостиницы»")
@Controller()
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @ApiOperation({
    summary: "Добавление гостиницы администратором.",
  })
  @UsePipes(ValidationPipe)
  @Post("admin/hotels/")
  async addHotels(
    @Body() data: AddHotelParamsDto,
  ): Promise<Partial<HotelDocument>> {
    try {
      const hotel = await this.hotelService.create(data);
      return {
        id: hotel._id,
        title: hotel.title,
        description: hotel.description,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Получение списка гостиниц администратором.",
  })
  @Get("admin/hotels/")
  async getHotels(
    @Query() params: SearchHotelParamsDto,
  ): Promise<HotelDocument[]> {
    return this.hotelService.search(params);
  }

  @ApiOperation({
    summary: "Изменение описания гостиницы администратором.",
  })
  @ApiParam({ name: "id" })
  @Put("admin/hotels/:id")
  async changeHotel(
    @Param("id") id: ID,
    @Body() data: UpdateHotelParamsDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const hotel = await this.hotelService.update(id, data);
      res.json({
        id: hotel._id,
        title: hotel.title,
        description: hotel.description,
      });
    } catch (error) {
      res.status(404).json({
        error: true,
        message: error.message,
      });
    }
  }
}
