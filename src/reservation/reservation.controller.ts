import {
  Controller,
  Delete,
  Get,
  Body,
  Post,
  BadRequestException,
  Req,
  UseGuards,
  Query,
  Param,
  ForbiddenException,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationDto } from "./dto/reservation.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
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
import { ID } from "src/types/id";
import { IsManager } from "src/guards/is-manager.guard";

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
    const validHotelRoomId = isValidIdHandler(hotelRoom);
    const client = request.user as User;
    const user = await this.UserModel.findOne({ email: client.email });
    const room = await this.HotelRoomModel.findOne({ _id: validHotelRoomId });
    if (!room) {
      throw new BadRequestException("Такой номер не найден");
    }
    if (!room.isEnabled) {
      throw new BadRequestException("Номер недоступен");
    }
    const hotel = await this.HotelModel.findById({ _id: room.hotel });
    const hotelId = room.hotel as string;
    const userId = user._id.toString();
    const roomId = room._id.toString();
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

  @UseGuards(IsAuthenticatedGuard, IsClient)
  @ApiOperation({
    summary: "Список броней текущего пользователя.",
  })
  @ApiQuery({ name: "dateStart", example: "2009-02-29" })
  @ApiQuery({ name: "dateEnd", example: "2009-04-29" })
  @Get("client/reservations")
  async getClientReservations(
    @Req() request: Request,
    @Query("dateStart") dateStart: string,
    @Query("dateEnd") dateEnd: string,
  ): Promise<any[]> {
    const client = request.user as User;
    const user = await this.UserModel.findOne({ email: client.email });
    const reservations = await this.reservationService.getReservations({
      userId: user._id as never as ID,
      dateStart: new Date(dateStart),
      dateEnd: new Date(dateEnd),
    });

    return reservationsHandler(reservations, this);
  }

  @UseGuards(IsAuthenticatedGuard, IsClient)
  @ApiOperation({
    summary: "Отмена бронирования клиентом.",
  })
  @Delete("client/reservations/:id")
  async removeClientReservations(
    @Param("id") id: string,
    @Req() request: Request,
  ) {
    const isValidReservationId = isValidIdHandler(id);
    const client = request.user as User;
    const user = await this.UserModel.findOne({ email: client.email });
    const userId = user._id.toString();
    const roomReservation =
      await this.ReservationModel.findById(isValidReservationId);
    if (!roomReservation) {
      throw new BadRequestException("Бронь не найдена");
    }
    const roomReservationUserId = roomReservation.userId.toString();
    if (userId !== roomReservationUserId) {
      throw new ForbiddenException(
        "Нельзя отменить бронь другого пользователя",
      );
    }

    this.reservationService.removeReservation(isValidReservationId);
  }

  @UseGuards(IsAuthenticatedGuard, IsManager)
  @ApiOperation({
    summary: "Список броней конкретного пользователя.",
  })
  @Get("manager/reservations/:userId")
  async getManagerReservationsForClient(
    @Param("userId") userId: string,
  ): Promise<any[]> {
    const reservations = await this.ReservationModel.find({ userId });
    return reservationsHandler(reservations, this);
  }

  @UseGuards(IsAuthenticatedGuard, IsManager)
  @ApiOperation({
    summary: "Отмена бронирования менеджером.",
  })
  @Delete("manager/reservations/:id")
  async removeManagerReservationsForClient(
    @Param("id") id: string,
  ): Promise<void> {
    const reservation = await this.ReservationModel.findById(id);
    if (!reservation) {
      throw new BadRequestException("Бронь не найдена");
    }
    this.reservationService.removeReservation(id);
  }
}

function reservationsHandler(
  reservations: Reservation[],
  context,
): Promise<any[]> {
  const reservationPromises = reservations.map(async (reservation) => {
    const [room, hotel] = await Promise.all([
      context.HotelRoomModel.findById(reservation.roomId),
      context.HotelModel.findById(reservation.hotelId),
    ]);
    return {
      startDate: reservation.dateStart,
      endDate: reservation.dateEnd,
      hotelRoom: {
        description: room?.description,
        images: room?.images,
      },
      hotel: {
        title: hotel?.title,
        description: hotel?.description,
      },
    };
  });
  return Promise.all(reservationPromises);
}
