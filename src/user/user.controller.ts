import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UsePipes,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDocument } from "./entities/user.entity";
import { SearchUserDto } from "./dto/search-user.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("API Модуля «Управление пользователями»")
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

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
