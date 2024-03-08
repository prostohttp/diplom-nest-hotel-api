import { Injectable } from "@nestjs/common";
import { ISupportRequestClientService } from "../interfaces/support-request-client-service.interface";
import { ID } from "src/types/id";
import { SupportRequest } from "../entities/support-request.entity";
import { CreateSupportRequestDto } from "../interfaces/create-support-request-dto.interface";
import { MarkMessagesAsReadDto } from "../interfaces/mark-messages-as-read-dto.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "../entities/message.entity";

@Injectable()
export class SupportClientService implements ISupportRequestClientService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}
  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const message = new this.messageModel({
      author: data.user,
      sentAt: new Date(),
      text: data.text,
    });
    await message.save();

    const supportRequest = new this.supportRequestModel({
      user: data.user,
      createdAt: new Date(),
      messages: [message._id],
      isActive: true,
    });
    return supportRequest.save();
  }
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const {
      user: userId,
      supportRequest: supportRequestId,
      createdBefore,
    } = params;
    const supportRequest =
      await this.supportRequestModel.findById(supportRequestId);

    const messageIds = supportRequest.messages;

    const messagesToUpdate = await this.messageModel.find({
      _id: { $in: messageIds },
      author: { $ne: userId },
      sentAt: { $lt: createdBefore },
      readAt: { $exists: false },
    });

    await Promise.all(
      messagesToUpdate.map(async (message) => {
        message.readAt = new Date();
        await message.save();
      }),
    );
  }
  async getUnreadCount(supportRequest: ID): Promise<number> {
    const fondedSupportRequest =
      await this.supportRequestModel.findById(supportRequest);
    const userId = fondedSupportRequest.user;
    const messageIds = fondedSupportRequest.messages;

    const messages = await this.messageModel.find({
      _id: { $in: messageIds },
      author: { $ne: userId },
      readAt: { $exists: false },
    });

    return messages.length;
  }
}
