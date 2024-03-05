import { Controller, Post, Get } from "@nestjs/common";
import { SupportRequestService } from "./request.service";

@Controller("")
export class SupportRequestController {
  constructor(private readonly chatService: SupportRequestService) {}

  @Post("client/support-requests/")
  async createMessage() {
    return "Create message";
  }

  @Get("client/support-requests/")
  async getMessages() {
    return "Get message";
  }

  @Get("manager/support-requests/")
  async getMessagesForManager() {
    return "Get message for manager";
  }

  @Get("common/support-requests/:id/messages")
  async getHistory() {
    return "Get history of messages";
  }

  @Post("common/support-requests/:id/messages")
  async sendMessage() {
    return "Send message";
  }

  @Post("common/support-requests/:id/messages/read")
  async readMessages() {
    return "Read messages";
  }
}
