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
  NotFoundException,
  ForbiddenException,
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
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { isValidIdHandler } from "src/utils";
import { UserRoles } from "src/types/user-roles";
import { IsManagerOrClient } from "src/guards/is-manager-or-client.guard";

@ApiTags("API модуля «Чат с техподдержкой»")
@Controller()
export class SupportRequestController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportClientRequestService: SupportClientService,
    private readonly supportEmployeeRequestService: SupportEmployeeService,
    private readonly userService: UserService,
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
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

    const supportRequestPromises = supportRequests.map(async (request) => {
      const messages = await this.supportRequestService.getMessages(
        request["_id"],
      );
      const hasNewMessages = !messages.every((message) => message.readAt);
      return {
        id: request["_id"].toString(),
        createdAt: new Date().toString(),
        isActive: request.isActive,
        hasNewMessages: hasNewMessages,
      };
    });

    return Promise.all(supportRequestPromises);
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
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("isActive") isActive: boolean = true,
  ): Promise<MessageResponseDto[]> {
    const allRequests = await this.supportRequestModel
      .find({ isActive })
      .limit(limit)
      .skip(offset);
    const supportRequests = allRequests.map(async (request) => {
      const user = await this.userService.findById(request.user);
      const messages = await this.supportRequestService.getMessages(
        request._id.toString(),
      );
      const hasNewMessages = !messages.every((message) => message.readAt);
      return {
        id: request._id.toString(),
        createdAt: request.createdAt.toString(),
        isActive: request.isActive,
        hasNewMessages: hasNewMessages,
        client: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          contactPhone: user.contactPhone,
        },
      };
    });
    return Promise.all(supportRequests);
  }

  @ApiOperation({
    summary: "Получение истории сообщений из обращения в тех поддержку",
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
  @UseGuards(IsAuthenticatedGuard, IsManagerOrClient)
  @Get("common/support-requests/:id/messages")
  async getHistory(
    @Param("id") id: string,
    @Req() request: Request,
  ): Promise<HistoryMessageResponseDto[]> {
    const user = request.user as User;
    const client = await this.userService.findByEmail(user.email);
    const isValidSupportRequest = isValidIdHandler(id);
    const supportRequest = await this.supportRequestModel.findById(
      isValidSupportRequest,
    );
    if (!supportRequest) {
      throw new NotFoundException("Такого обращения нет");
    }
    if (
      user.role === UserRoles.Client &&
      client._id.toString() !== supportRequest.user.toString()
    ) {
      throw new ForbiddenException("У вас нет доступа к этому обращению");
    }
    const supportRequestMessages =
      await this.supportRequestService.getMessages(id);
    const messages = supportRequestMessages.map(async (message) => {
      const author = await this.userService.findById(message.author);
      return {
        id: message["_id"],
        createdAt: message.sentAt.toString(),
        text: message.text,
        readAt: message.readAt ? message.readAt.toString() : null,
        author: {
          id: author._id.toString(),
          name: author.name,
        },
      };
    });

    return Promise.all(messages);
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
  @UseGuards(IsAuthenticatedGuard, IsManagerOrClient)
  @Post("common/support-requests/:id/messages")
  async sendMessage(
    @Body() data: CreateMessageDto,
    @Param("id") id: string,
    @Req() request: Request,
  ): Promise<HistoryMessageResponseDto[]> {
    const user = request.user as User;
    const client = await this.userService.findByEmail(user.email);
    const isValidSupportRequest = isValidIdHandler(id);
    const supportRequest = await this.supportRequestModel.findById(
      isValidSupportRequest,
    );
    if (!supportRequest) {
      throw new NotFoundException("Такого обращения нет");
    }
    if (
      user.role === UserRoles.Client &&
      client._id.toString() !== supportRequest.user.toString()
    ) {
      throw new ForbiddenException("У вас нет доступа к этому обращению");
    }
    const message = await this.supportRequestService.sendMessage({
      author: client._id.toString(),
      supportRequest: isValidSupportRequest,
      text: data.text,
    });

    return [
      {
        id: supportRequest._id.toString(),
        createdAt: message.sentAt.toString(),
        text: message.text,
        readAt: message.readAt ? message.readAt.toString() : null,
        author: {
          id: client._id.toString(),
          name: client.name,
        },
      },
    ];
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
