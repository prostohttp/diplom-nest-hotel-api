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
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAdmin } from "src/guards/is-admin.guard";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsManager } from "src/guards/is-manager.guard";

@ApiTags("API Модуля «Управление пользователями»")
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(IsAuthenticatedGuard, IsAdmin)
  @ApiOperation({
    summary:
      "Позволяет пользователю с ролью admin создать пользователя в системе.",
  })
  @UsePipes(ValidationPipe)
  @Post("admin/users/")
  async create(@Body() data: CreateUserDto): Promise<Partial<UserDocument>> {
    const user = await this.userService.create(data);
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }

  @UseGuards(IsAuthenticatedGuard, IsAdmin)
  @ApiOperation({
    summary: "Получение списка пользователей юзером с ролью admin.",
  })
  @Get("admin/users/")
  async getUserForAdmin(
    @Query() params: SearchUserDto,
  ): Promise<Partial<UserDocument>[]> {
    const users = await this.userService.findAll(params);
    return users.map(({ _id, email, name, contactPhone }) => ({
      id: _id,
      email,
      name,
      contactPhone,
    })) as Partial<UserDocument>[];
  }

  @UseGuards(IsAuthenticatedGuard, IsManager)
  @ApiOperation({
    summary: "Получение списка пользователей юзером с ролью manager.",
  })
  @Get("manager/users/")
  async getUserForManager(
    @Query() params: SearchUserDto,
  ): Promise<Partial<UserDocument>[]> {
    const users = await this.userService.findAll(params);
    return users.map(({ _id, email, name, contactPhone }) => ({
      id: _id,
      email,
      name,
      contactPhone,
    })) as Partial<UserDocument>[];
  }
}
