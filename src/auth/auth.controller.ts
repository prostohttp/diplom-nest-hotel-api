import {
  Body,
  Controller,
  Post,
  Req,
  Session,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserRequestParamsDto } from "./dto/user-request-params.dto";
import { LocalAuthGuard } from "src/guards/auth.guard";
import { Request } from "express";
import { IsAuthenticatedGuard } from "src/guards/authenticated.guard";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(
    @Body() params: UserRequestParamsDto,
    @Req() request: Request,
    @Session() session: any,
  ) {
    const user = await this.authService.validateUser(
      params.email,
      params.password,
    );
    if (user) {
      session.userId = user.email;
      request.cookies["userId"] = user.email;
      return this.authService.validateUser(params.email, params.password);
    }
  }
  @UseGuards(IsAuthenticatedGuard)
  @Post("auth/logout")
  async logout() {
    return "Logout";
  }

  @Post("client/register")
  async register() {
    return "Register";
  }
}
