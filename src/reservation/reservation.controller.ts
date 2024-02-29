import {
  Controller,
  Delete,
  Get,
  Body,
  Post,
  BadRequestException,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationDto } from "./dto/reservation.dto";

@Controller("")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post("client/reservations")
  async addClientReservations(
    @Body() reservationDto: ReservationDto,
  ): Promise<any> {
    const { hotelRoom, startDate, endDate } = reservationDto;
    try {
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get("client/reservations")
  async getClientReservations() {
    return "Get Client reservation";
  }

  @Delete("client/reservations/:id")
  async removeClientReservations() {
    return "Remove Client reservation";
  }

  @Get("manager/reservations/:userId")
  async getManagerReservationsForClient() {
    return "Get manager reservation for client";
  }

  @Delete("manager/reservations/:id")
  async removeManagerReservationsForClient() {
    return "Remove manager reservation for client";
  }
}
