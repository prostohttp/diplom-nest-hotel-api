import {
  Controller,
  Delete,
  Get,
  Body,
  Post,
  BadRequestException,
  Req,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationDto } from "./dto/reservation.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsClient } from "src/guards/is-client.guard";
import { InjectModel } from "@nestjs/mongoose";
import { Reservation } from "./entities/reservation.entity";
import { Hotel } from "src/hotel/entities/hotel.entity";
import { HotelRoom } from "src/hotel/entities/hotel-room.entity";
import { Model } from "mongoose";
import { User } from "src/user/entities/user.entity";
import { isValidIdHandler } from "src/utils";

@ApiTags("API Модуля «Бронирование»")
@Controller()
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    @InjectModel(Reservation.name) private ReservationModel: Model<Reservation>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Hotel.name) private HotelModel: Model<Hotel>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoom>,
  ) {}

  @ApiOperation({
    summary: "Бронирование номера клиентом.",
  })
  @UseGuards(IsAuthenticatedGuard, IsClient)
  @Post("client/reservations")
  async addClientReservations(
    @Body() reservationDto: ReservationDto,
    @Req() request: Request,
  ): Promise<any> {
    const { hotelRoom, startDate, endDate } = reservationDto;
    const validHotelRoom = isValidIdHandler(hotelRoom);
    const client = request.user as User;
    const user = await this.UserModel.findOne({ email: client.email });
    const room = await this.HotelRoomModel.findOne({ _id: validHotelRoom });
    if (!room) {
      throw new NotFoundException("Такой номер не найден");
    }
    const hotel = await this.HotelModel.findById({ _id: room.hotel });
    const hotelId = room.hotel as string;
    const userId = user._id as unknown as string;
    const roomId = room._id as unknown as string;
    const data = {
      userId,
      hotelId,
      roomId,
      dateStart: new Date(startDate),
      dateEnd: new Date(endDate),
    };

    try {
      const reservation = await this.reservationService.addReservation(data);
      return {
        startDate: reservation.dateStart,
        endDate: reservation.dateEnd,
        hotelRoom: {
          description: room.description,
          images: room.images,
        },
        hotel: {
          title: hotel.title,
          description: hotel.description,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @ApiOperation({
    summary: "Список броней текущего пользователя.",
  })
  @Get("client/reservations")
  async getClientReservations() {
    return "Get Client reservation";
  }

  @ApiOperation({
    summary: "Отмена бронирования клиентом.",
  })
  @Delete("client/reservations/:id")
  async removeClientReservations() {
    return "Remove Client reservation";
  }

  @ApiOperation({
    summary: "Список броней конкретного пользователя.",
  })
  @Get("manager/reservations/:userId")
  async getManagerReservationsForClient() {
    return "Get manager reservation for client";
  }

  @ApiOperation({
    summary: "Отмена бронирования менеджером.",
  })
  @Delete("manager/reservations/:id")
  async removeManagerReservationsForClient() {
    return "Remove manager reservation for client";
  }
}
