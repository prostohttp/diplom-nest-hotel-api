import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateHotelParamsDto } from "./dto/update-hotel-params.dto";
import { AddHotelParamsDto } from "./dto/add-hotel-params.dto";
import { SearchHotelParamsDto } from "./dto/search-hotel-params.dto";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsAdmin } from "src/guards/is-admin.guard";
import { AddHotelResponseDto } from "./dto/add-hotel-response.dto";
import { ParseMongoIdPipe } from "src/pipes/parse-mongo-id.pipe";

@ApiTags("API Модуля «Гостиницы»")
@Controller()
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @ApiOperation({
    summary: "Добавление гостиницы.",
    description: "Добавление гостиницы администратором.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsAdmin)
  @UsePipes(ValidationPipe)
  @Post("admin/hotels/")
  async addHotels(
    @Body() data: AddHotelParamsDto,
  ): Promise<AddHotelResponseDto> {
    try {
      const hotel = await this.hotelService.create(data);
      return {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Получение списка гостиниц.",
    description: "Получение списка гостиниц администратором.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsAdmin)
  @Get("admin/hotels/")
  async getHotels(
    @Query() params: SearchHotelParamsDto,
  ): Promise<AddHotelResponseDto[]> {
    try {
      const hotels = await this.hotelService.search(params);
      return hotels.map((hotel) => ({
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      }));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Изменение описания гостиницы.",
    description: "Изменение описания гостиницы администратором.",
  })
  @ApiParam({ name: "id" })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsAdmin)
  @Put("admin/hotels/:id")
  async changeHotel(
    @Param("id", ParseMongoIdPipe) id: string,
    @Body() data: UpdateHotelParamsDto,
  ): Promise<AddHotelResponseDto> {
    try {
      const hotel = await this.hotelService.update(id, data);
      if (!hotel) {
        throw new NotFoundException("Гостиница не найдена");
      }
      return {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
