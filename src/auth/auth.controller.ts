import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("auth/login")
  async login() {
    return "Login";
  }

  @Post("auth/logout")
  async logout() {
    return "Logout";
  }

  @Post("client/register")
  async register() {
    return "Register";
  }
}
