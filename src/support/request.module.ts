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
import { UserService } from "src/user/user.service";
import { User, UserSchema } from "src/user/entities/user.entity";
import { SupportClientService } from "./client/client.service";
import { SupportEmployeeService } from "./employee/employee.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    SupportGateway,
    SupportRequestService,
    SupportClientService,
    SupportEmployeeService,
    UserService,
  ],
  controllers: [SupportRequestController],
})
export class SupportRequestModule {}
