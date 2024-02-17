import { Controller, Post, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("admin/users/")
  async create() {
    return "Create user";
  }

  @Get("admin/users/")
  async getUserForAdmin() {
    return "Get user for admin";
  }

  @Get("manager/users/")
  async getUserForManager() {
    return "Get user for manager";
  }
}
