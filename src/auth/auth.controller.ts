import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "src/guards/auth.guard";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { UserRoles } from "src/types/user-roles";
import { SignUpDto } from "./dto/user-sign-up.dto";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsNotAuthenticatedGuard } from "src/guards/is-not-authenticated.guard";
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { UserSignInResponseDto } from "./dto/user-sign-in-response.dto";
import { UserSignUpResponseDto } from "./dto/user-sign-up-response.dto";

@ApiTags("API Модуля «Аутентификация и авторизация»")
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: "Вход.",
    description: "Стартует сессию пользователя и выставляет Cookies.",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          default: "admin@site.ru",
        },
        password: { type: "string", default: "12345" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      "Если пользователя с указанным email не существует или пароль неверный",
  })
  @UseGuards(IsNotAuthenticatedGuard, LocalAuthGuard)
  @Post("auth/login")
  async login(@Req() req: Request): Promise<UserSignInResponseDto> {
    const user = await this.authService.login(req);
    return {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    };
  }

  @ApiOperation({
    summary: "Выход.",
    description:
      "Завершает сессию пользователя и удаляет Cookies. Доступно только аутентифицированным пользователям.",
  })
  @UseGuards(IsAuthenticatedGuard)
  @Post("auth/logout")
  logout(@Req() request: Request, @Res() response: Response): Promise<any> {
    return this.authService.logout(request, response);
  }

  @ApiOperation({
    summary: "Регистрация.",
    description: "Позволяет создать пользователя с ролью client в системе.",
  })
  @ApiResponse({
    status: 400,
    description: "Пользователь с таким email уже существует",
  })
  @Post("client/register")
  async register(@Body() data: SignUpDto): Promise<UserSignUpResponseDto> {
    const user = await this.userService.create({
      ...data,
      role: UserRoles.Client,
    });
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }
}
