import {
  Controller,
  Delete,
  Get,
  Body,
  Post,
  BadRequestException,
  UseGuards,
  Query,
  Param,
  ForbiddenException,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationDto } from "./dto/reservation.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsClient } from "src/guards/is-client.guard";
import { InjectModel } from "@nestjs/mongoose";
import { Reservation } from "./entities/reservation.entity";
import { Hotel } from "src/hotel/entities/hotel.entity";
import { HotelRoom } from "src/hotel/entities/hotel-room.entity";
import { Model } from "mongoose";
import { User } from "src/user/entities/user.entity";
import { IsManager } from "src/guards/is-manager.guard";
import { AddReservationResponseDto } from "./dto/add-reservation-response.dto";
import { ParseMongoIdPipe } from "src/pipes/parse-mongo-id.pipe";
import { LoggedUser } from "src/decorators/user.decorator";

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

  reservationsHandler(reservations: Reservation[]): Promise<any[]> {
    const reservationPromises = reservations.map(async (reservation) => {
      const [room, hotel] = await Promise.all([
        this.HotelRoomModel.findById(reservation.roomId),
        this.HotelModel.findById(reservation.hotelId),
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

  @ApiOperation({
    summary: "Бронирование номера клиентом.",
    description:
      "Создаёт бронь на номер на выбранную дату для текущего пользователя.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "роль должна быть client",
  })
  @ApiResponse({
    status: 400,
    description: "номера с указанным ID не существует или он отключен",
  })
  @UseGuards(IsAuthenticatedGuard, IsClient)
  @Post("client/reservations")
  async addClientReservations(
    @Body() reservationDto: ReservationDto,
    @LoggedUser() loggedUser: User,
  ): Promise<AddReservationResponseDto> {
    try {
      const { hotelRoom, startDate, endDate } = reservationDto;
      const user = await this.UserModel.findOne({ email: loggedUser.email });
      const room = await this.HotelRoomModel.findOne({ _id: hotelRoom });
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

      const reservation = await this.reservationService.addReservation(data);
      return {
        startDate: reservation.dateStart.toString(),
        endDate: reservation.dateEnd.toString(),
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
    description: "Список броней текущего пользователя.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "роль должна быть client",
  })
  @ApiQuery({ name: "dateStart", example: "2009-02-29" })
  @ApiQuery({ name: "dateEnd", example: "2009-04-29" })
  @UseGuards(IsAuthenticatedGuard, IsClient)
  @Get("client/reservations")
  async getClientReservations(
    @LoggedUser() loggedUser: User,
    @Query("dateStart") dateStart: string,
    @Query("dateEnd") dateEnd: string,
  ): Promise<AddReservationResponseDto[]> {
    try {
      const user = await this.UserModel.findOne({ email: loggedUser.email });
      const reservations = await this.reservationService.getReservations({
        userId: user._id.toString(),
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
      });

      return this.reservationsHandler(reservations);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Отмена бронирования клиентом.",
    description:
      "Доступно только аутентифицированным пользователям с ролью client.",
  })
  @ApiResponse({
    status: 200,
    description: "бронь удалена",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description:
      "роль должна быть client, если ID текущего пользователя не совпадает с ID пользователя в брони",
  })
  @ApiResponse({
    status: 400,
    description: "если брони с указанным ID не существует",
  })
  @UseGuards(IsAuthenticatedGuard, IsClient)
  @Delete("client/reservations/:id")
  async removeClientReservations(
    @Param("id", ParseMongoIdPipe) id: string,
    @LoggedUser() loggedUser: User,
  ): Promise<void> {
    try {
      const user = await this.UserModel.findOne({ email: loggedUser.email });
      const userId = user._id.toString();
      const roomReservation = await this.ReservationModel.findById(id);
      if (!roomReservation) {
        throw new BadRequestException("Бронь не найдена");
      }
      const roomReservationUserId = roomReservation.userId.toString();
      if (userId !== roomReservationUserId) {
        throw new ForbiddenException(
          "Нельзя отменить бронь другого пользователя",
        );
      }

      this.reservationService.removeReservation(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Список броней конкретного пользователя.",
    description:
      "Доступно только аутентифицированным пользователям с ролью manager.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "роль должна быть manager",
  })
  @UseGuards(IsAuthenticatedGuard, IsManager)
  @Get("manager/reservations/:userId")
  async getManagerReservationsForClient(
    @Param("userId", ParseMongoIdPipe) userId: string,
  ): Promise<AddReservationResponseDto[]> {
    try {
      const reservations = await this.ReservationModel.find({
        userId,
      });
      return this.reservationsHandler(reservations);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: "Отмена бронирования менеджером.",
  })
  @ApiResponse({
    status: 200,
    description: "бронь удалена",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "роль должна быть manager",
  })
  @ApiResponse({
    status: 400,
    description: "если брони с указанным ID не существует",
  })
  @UseGuards(IsAuthenticatedGuard, IsManager)
  @Delete("manager/reservations/:id")
  async removeManagerReservationsForClient(
    @Param("id", ParseMongoIdPipe) id: string,
  ): Promise<void> {
    try {
      const reservation = await this.ReservationModel.findById(id);
      if (!reservation) {
        throw new BadRequestException("Бронь не найдена");
      }
      this.reservationService.removeReservation(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
