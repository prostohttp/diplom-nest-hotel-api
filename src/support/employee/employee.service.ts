import { BadRequestException, Injectable } from "@nestjs/common";
import { ISupportRequestEmployeeService } from "../interfaces/support-request-employee-service.interface";
import { ID } from "src/types/id";
import { MarkMessagesAsReadDto } from "../interfaces/mark-messages-as-read-dto.interface";
import { InjectModel } from "@nestjs/mongoose";
import { SupportRequest } from "../entities/support-request.entity";
import { Model } from "mongoose";
import { Message } from "../entities/message.entity";

@Injectable()
export class SupportEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    try {
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
        author: userId,
        sentAt: { $lt: createdBefore },
        readAt: { $exists: false },
      });

      await Promise.all(
        messagesToUpdate.map(async (message) => {
          message.readAt = new Date();
          await message.save();
        }),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getUnreadCount(supportRequest: ID): Promise<number> {
    const fondedSupportRequest =
      await this.supportRequestModel.findById(supportRequest);
    const userId = fondedSupportRequest.user;
    const messageIds = fondedSupportRequest.messages;

    const messages = await this.messageModel.find({
      _id: { $in: messageIds },
      author: userId,
      readAt: { $exists: false },
    });

    return messages.length;
  }
  closeRequest(supportRequest: ID): Promise<void> {
    return this.supportRequestModel.findByIdAndUpdate(supportRequest, {
      isActive: false,
    });
  }
}
