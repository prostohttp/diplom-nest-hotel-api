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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [SupportGateway, SupportRequestService],
  controllers: [SupportRequestController],
})
export class SupportRequestModule {}
