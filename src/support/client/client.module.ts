import { Module } from "@nestjs/common";
import { SupportClientService } from "./client.service";
import { SupportClientController } from "./client.controller";

@Module({
  controllers: [SupportClientController],
  providers: [SupportClientService],
})
export class SupportClientModule {}
