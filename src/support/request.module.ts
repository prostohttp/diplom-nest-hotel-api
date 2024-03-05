import { Module } from "@nestjs/common";
import { SupportRequestService } from "./request.service";
import { SupportGateway } from "./request.gateway";
import { SupportRequestController } from "./request.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SupportRequest,
  SupportRequestSchema,
} from "./entities/support-request.entity";
import { Message, MessageSchema } from "./entities/message.entity";
import { SupportClientService } from "./client/client.service";
import { SupportEmployeeService } from "./employee/employee.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [
    SupportGateway,
    SupportRequestService,
    SupportClientService,
    SupportEmployeeService,
  ],
  controllers: [SupportRequestController],
})
export class SupportRequestModule {}
