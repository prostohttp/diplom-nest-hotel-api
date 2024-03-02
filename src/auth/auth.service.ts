import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
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
      throw new NotFoundException("Такого пользователя не существует");
    }
    const passwordHash = await bcrypt.compare(password, user.passwordHash);
    if (!passwordHash) {
      throw new BadGatewayException("Имя или пароль не верны");
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
}
