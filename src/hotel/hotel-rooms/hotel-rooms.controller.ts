import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { promises as fs } from "fs";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { HotelRoomsService } from "./hotel-rooms.service";
import { AddHotelRoomParamsDto } from "../dto/add-hotel-room-params.dto";
import { HotelService } from "../hotel.service";
import { storageConfig } from "./config/disk-storage";
import { HotelRoomDocument } from "../entities/hotel-room.entity";
import { UpdateHotelRoomParamsDto } from "../dto/update-hotel-room-params.dto";
import { SearchRoomsParams } from "../interfaces/search-rooms-params.interface";

@ApiTags("API Модуля «Гостиницы»")
@Controller()
export class HotelRoomsController {
  constructor(
    private readonly hotelRoomsService: HotelRoomsService,
    private readonly hotelService: HotelService,
  ) {}

  @ApiOperation({
    summary: "Добавление номера гостиницы администратором.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["hotelId", "description"],
      properties: {
        hotelId: {
          type: "string",
          default: "65db5daa2f65467396335835",
        },
        description: { type: "string", default: "Some description 1" },
        images: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: storageConfig,
    }),
  )
  @Post("admin/hotel-rooms/")
  async addHotelRoom(
    @Body() data: AddHotelRoomParamsDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\// })],
        fileIsRequired: false,
      }),
    )
    multerImagesArray: Express.Multer.File[],
  ): Promise<any> {
    try {
      const hotel = await this.hotelService.findById(data.hotelId);
      const images = multerImagesArray.map((file) => file.path);

      if (!hotel) {
        throw new BadRequestException("Гостиница не найдена");
      }
      const hotelRoom = await this.hotelRoomsService.create({
        hotel: data.hotelId,
        description: data.description,
        images: images,
      });

      return {
        id: hotelRoom._id,
        description: hotelRoom.description,
        images: images,
        isEnabled: hotelRoom.isEnabled,
        hotel: {
          id: hotel._id,
          title: hotel.title,
          description: hotel.description,
        },
      };
    } catch (error) {
      if (multerImagesArray && multerImagesArray.length > 0) {
        try {
          for (const file of multerImagesArray) {
            await fs.unlink(file.path);
          }
        } catch (error) {
          throw new InternalServerErrorException("Ошибка при удалении файлов");
        }
      }
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Поиск номеров",
  })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "offset", required: false, type: Number })
  @ApiQuery({ name: "hotel", required: true, type: String })
  @ApiQuery({ name: "isEnabled", required: false, type: Boolean })
  @ApiBadRequestResponse({ description: "Неверные параметры запроса" })
  @ApiNotFoundResponse({ description: "Гостиница не найдена" })
  @ApiResponse({ status: 200, description: "Успешный запрос", type: [Object] })
  @Get("common/hotel-rooms")
  async getHotelRooms(@Query() params: SearchRoomsParams): Promise<Array<any>> {
    const { limit, offset, hotel, isEnabled = undefined } = params;

    try {
      const searchedHotel = await this.hotelService.findById(hotel);
      if (!searchedHotel) {
        throw new NotFoundException("Гостиница не найдена");
      }
      const searchedRooms = await this.hotelRoomsService.search({
        limit,
        offset,
        hotel,
        isEnabled,
      });
      return searchedRooms.map((room) => ({
        id: room._id,
        description: room.description,
        images: room.images,
        isEnabled: room.isEnabled,
        hotel: {
          id: searchedHotel._id,
          title: searchedHotel.title,
        },
      }));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Информация о конкретном номере.",
  })
  @ApiParam({
    name: "id",
    description: "Идентификатор номера",
    type: String,
  })
  @ApiNotFoundResponse({ description: "Номер не найден" })
  @Get("common/hotel-rooms/:id")
  async getHotelRoom(
    @Param("id") id: string,
  ): Promise<Partial<HotelRoomDocument>> {
    try {
      const hotelRoom = await this.hotelRoomsService.findById(id);
      if (hotelRoom) {
        return hotelRoom;
      } else {
        throw new NotFoundException("Номер не найден");
      }
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @ApiOperation({
    summary: "Изменение описания номера гостиницы администратором.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["hotelId"],
      properties: {
        hotelId: {
          type: "string",
          default: "65dbd06bb157f90e2343cbb3",
        },
        description: {
          type: "string",
          default: "Новое описание номера гостиницы",
        },
        images: {
          type: "string",
          format: "binary",
        },
        isEnabled: {
          type: "boolean",
          default: true,
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: storageConfig,
    }),
  )
  @Put("admin/hotel-rooms/:id")
  async changeHotelRoom(
    @Param("id") id: string,
    @Body() data: UpdateHotelRoomParamsDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\// })],
        fileIsRequired: false,
      }),
    )
    multerImagesArray: Express.Multer.File[],
  ): Promise<any> {
    try {
      const hotel = await this.hotelService.findById(data.hotelId);
      const hotelRoom = await this.hotelRoomsService.findById(id);
      const images = multerImagesArray.map((file) => file.path);

      if (!hotel) {
        throw new BadRequestException("Гостиница не найдена");
      }
      if (!hotelRoom) {
        throw new BadRequestException("Номер не найден");
      }
      const updatedHotelRoom = await this.hotelRoomsService.update(id, {
        hotel: data.hotelId,
        description: data.description,
        isEnabled: data.isEnabled,
        images: [...hotelRoom.images, ...images],
      });

      return {
        id: updatedHotelRoom._id,
        description: updatedHotelRoom.description,
        images: updatedHotelRoom.images,
        isEnabled: updatedHotelRoom.isEnabled,
        hotel: {
          id: hotel._id,
          title: hotel.title,
          description: hotel.description,
        },
      };
    } catch (error) {
      if (multerImagesArray && multerImagesArray.length > 0) {
        try {
          for (const file of multerImagesArray) {
            await fs.unlink(file.path);
          }
        } catch (error) {
          throw new InternalServerErrorException("Ошибка при удалении файлов");
        }
      }
      throw new BadRequestException(error.message);
    }
  }
}
