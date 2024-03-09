import { Injectable } from "@nestjs/common";
import { ISupportRequestService } from "./interfaces/support-request-service.interface";
import { ID } from "src/types/id";
import { Message } from "./entities/message.entity";
import { SupportRequest } from "./entities/support-request.entity";
import { GetChatListParams } from "./interfaces/get-chat-list-params.interface";
import { SendMessageDto } from "./interfaces/send-message-dto.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
    const { user, isActive } = params;
    if (!user) {
      return this.supportRequestModel.find({ isActive });
    }
    return this.supportRequestModel.find({ user, isActive });
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const { author, supportRequest, text } = data;
    const message = new this.messageModel({
      author,
      sentAt: new Date(),
      text,
    });
    await message.save();
    await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
      $push: { messages: message._id },
    });
    return message;
  }

  async getMessages(supportRequest: ID): Promise<Message[]> {
    const requestWithMessages = (await this.supportRequestModel
      .findById(supportRequest)
      .populate("messages")) as any;
    return requestWithMessages.messages;
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    throw new Error("Method not implemented.");
  }
}
