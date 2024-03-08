import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  BadGatewayException,
  Query,
  Param,
  Req,
} from "@nestjs/common";
import { SupportRequestService } from "./request.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IsClient } from "src/guards/is-client.guard";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { SupportClientService } from "./client/client.service";
import { SupportEmployeeService } from "./employee/employee.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateMessageRequestDto } from "./dto/create-message-request.dto";
import { IsManager } from "src/guards/is-manager.guard";
import { MessageResponseDto } from "./dto/message-response.dto";
import { HistoryMessageResponseDto } from "./dto/history-message-response.dto";
import { IsReadMessageResponseDto } from "./dto/is-read-message-response.dto";
import { IsCreatedMessageRequestDto } from "./dto/is-created-message-request.dto";
import { Request } from "express";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { SupportRequest } from "./entities/support-request.entity";

@ApiTags("API модуля «Чат с техподдержкой»")
@Controller()
export class SupportRequestController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportClientRequestService: SupportClientService,
    private readonly supportEmployeeRequestService: SupportEmployeeService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: "Создание обращения в поддержку.",
    description:
      "Позволяет пользователю с ролью client создать обращение в техподдержку. Доступно только пользователям с ролью client.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsClient)
  @Post("client/support-requests/")
  async createMessage(
    @Body() data: CreateMessageDto,
    @Req() request: Request,
  ): Promise<CreateMessageRequestDto[]> {
    const client = request.user as User;
    const user = await this.userService.findByEmail(client.email);
    const supportRequest =
      await this.supportClientRequestService.createSupportRequest({
        user: user._id.toString(),
        text: data.text,
      });
    return [
      {
        id: supportRequest["_id"].toString(),
        createdAt: new Date().toString(),
        isActive: true,
        hasNewMessages: false,
      },
    ];
  }

  @ApiOperation({
    summary: "Получение списка обращений в поддержку для клиента.",
    description:
      "Позволяет пользователю с ролью client получить список обращений для текущего пользователя.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsClient)
  @Get("client/support-requests/")
  async getSupportRequests(
    @Req() request: Request,
    @Query("limit") limit: string,
    @Query("offset") offset: string,
    @Query("isActive") isActive: boolean,
  ): Promise<CreateMessageRequestDto[]> {
    const client = request.user as User;
    const user = await this.userService.findByEmail(client.email);
    const userId = user._id.toString();

    const parsedLimit = limit ? parseInt(limit, 10) : null;
    const parsedOffset = offset ? parseInt(offset, 10) : null;

    let supportRequests = await this.supportRequestService.findSupportRequests({
      user: userId,
      isActive: isActive,
    });

    if (parsedLimit !== null && parsedOffset !== null) {
      supportRequests = supportRequests.slice(
        parsedOffset,
        parsedOffset + parsedLimit,
      );
    }

    const messages = await this.supportRequestService.getMessages(userId);

    return supportRequests.map((request) => {
      return {
        id: request["_id"].toString(),
        createdAt: new Date().toString(),
        isActive: request.isActive,
        hasNewMessages: !messages.every((message) => message.readAt),
      };
    });
  }

  @ApiOperation({
    summary: "Получение списка обращений в поддержку для менеджера",
    description:
      "Позволяет пользователю с ролью manager получить список обращений от клиентов.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsManager)
  @Get("manager/support-requests/")
  async getSupportRequestsForManager(
    @Query("limit") limit: string,
    @Query("offset") offset: string,
    @Query("isActive") isActive: string,
  ): Promise<MessageResponseDto[]> {
    throw new BadGatewayException("Bad gateway error");
  }

  @ApiOperation({
    summary: "Получение истории сообщений из обращения в техподдержку",
    description:
      "Позволяет пользователю с ролью manager или client получить все сообщения из чата.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsManager, IsClient)
  @Get("common/support-requests/:id/messages")
  async getHistory(
    @Param("id") id: string,
  ): Promise<HistoryMessageResponseDto[]> {
    throw new BadGatewayException("Bad gateway error");
  }

  @ApiOperation({
    summary: "Отправка сообщения",
    description:
      "Позволяет пользователю с ролью manager или client отправлять сообщения в чат.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsManager, IsClient)
  @Post("common/support-requests/:id/messages")
  async sendMessage(
    @Body() data: CreateMessageDto,
    @Param("id") id: string,
  ): Promise<HistoryMessageResponseDto[]> {
    throw new BadGatewayException("Bad gateway error");
  }

  @ApiOperation({
    summary: "Отправка события, что сообщения прочитаны",
    description:
      "Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны. Доступно только пользователям с ролью manager и пользователю с ролью client, который создал обращение.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsManager, IsClient)
  @Post("common/support-requests/:id/messages/read")
  async readMessages(
    @Body() data: IsCreatedMessageRequestDto,
    @Param("id") id: string,
  ): Promise<IsReadMessageResponseDto> {
    throw new BadGatewayException("Bad gateway error");
  }
}
