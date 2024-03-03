import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "src/guards/auth.guard";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { UserRoles } from "src/types/user-roles";
import { SignUpDto } from "./dto/user-sign-up.dto";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { IsNotAuthenticatedGuard } from "src/guards/is-not-authenticated.guard";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(IsNotAuthenticatedGuard, LocalAuthGuard)
  @Post("auth/login")
  async login(@Req() req: Request): Promise<any> {
    const user = await this.authService.login(req);
    return {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    };
  }

  @UseGuards(IsAuthenticatedGuard)
  @Post("auth/logout")
  logout(@Req() request: Request, @Res() response: Response): Promise<any> {
    return this.authService.logout(request, response);
  }

  @Post("client/register")
  async register(@Body() data: SignUpDto): Promise<any> {
    const user = await this.userService.create({
      ...data,
      role: UserRoles.Client,
    });
    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }
}
