import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ email: string; name: string; contactPhone: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Такого пользователя не существует");
    }
    const passwordHash = await bcrypt.compare(password, user.passwordHash);
    if (!passwordHash) {
      throw new UnauthorizedException("Имя или пароль не верны");
    }
    if (user && passwordHash) {
      return {
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      };
    }
    return null;
  }

  async login(req: Request): Promise<any> {
    return req.user;
  }

  async logout(request: Request, response: Response): Promise<any> {
    request.session.destroy(() => {
      response.status(HttpStatus.OK).json({
        message: "Вы успешно вышли",
      });
    });
  }
}
