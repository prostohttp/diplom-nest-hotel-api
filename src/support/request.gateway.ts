import { WebSocketGateway } from "@nestjs/websockets";
import { SupportRequestService } from "./request.service";

@WebSocketGateway()
export class SupportGateway {
  constructor(private readonly chatService: SupportRequestService) {}
}
