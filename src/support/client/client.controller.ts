import { Controller } from "@nestjs/common";
import { SupportClientService } from "./client.service";

@Controller("client")
export class SupportClientController {
  constructor(private readonly clientService: SupportClientService) {}
}
