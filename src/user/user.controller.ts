import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UsePipes,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDocument } from "./entities/user.entity";
import { SearchUserDto } from "./dto/search-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IsAdmin } from "src/guards/is-admin.guard";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsManager } from "src/guards/is-manager.guard";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { GetUserResponseDto } from "./dto/get-user-response.dto";

@ApiTags("API Модуля «Управление пользователями»")
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(IsAuthenticatedGuard, IsAdmin)
  @ApiOperation({
    summary: "Создание пользователя",
    description:
      "Позволяет пользователю с ролью admin создать пользователя в системе.",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UsePipes(ValidationPipe)
  @Post("admin/users/")
  async create(@Body() data: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.userService.create(data);
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }

  @ApiOperation({
    summary: "Получение списка пользователей",
    description: "Только для пользователей с ролью Admin",
  })
  @ApiResponse({
    status: 401,
    description: "если пользователь не аутентифицирован",
  })
  @ApiResponse({
    status: 403,
    description: "если роль пользователя не подходит",
  })
  @UseGuards(IsAuthenticatedGuard, IsAdmin)
  @Get("admin/users/")
  async getUserForAdmin(
    @Query() params: SearchUserDto,
  ): Promise<GetUserResponseDto[]> {
    const users = await this.userService.findAll(params);
    return users.map(({ _id, email, name, contactPhone }) => ({
      id: _id.toString(),
      email,
      name,
      contactPhone,
    }));
  }

  @ApiOperation({
    summary: "Получение списка пользователей",
    description: "Только для пользователей с ролью Manager",
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
  @Get("manager/users/")
  async getUserForManager(
    @Query() params: SearchUserDto,
  ): Promise<GetUserResponseDto[]> {
    const users = await this.userService.findAll(params);
    return users.map(({ _id, email, name, contactPhone }) => ({
      id: _id.toString(),
      email,
      name,
      contactPhone,
    }));
  }
}
