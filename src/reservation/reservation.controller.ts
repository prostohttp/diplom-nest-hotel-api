import { Controller, Delete, Get, Post } from "@nestjs/common";
import { ReservationService } from "./reservation.service";

@Controller("")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post("client/reservations")
  async addClientReservations() {
    return "Add Client reservation";
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
