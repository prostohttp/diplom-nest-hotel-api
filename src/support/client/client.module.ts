import { Module } from "@nestjs/common";
import { SupportClientService } from "./client.service";
import { SupportClientController } from "./client.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SupportRequest,
  SupportRequestSchema,
} from "../entities/support-request.entity";
import { Message, MessageSchema } from "../entities/message.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [SupportClientController],
  providers: [SupportClientService],
})
export class SupportClientModule {}
