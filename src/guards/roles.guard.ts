import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const grantAccess = roles[0]
      .toLocaleLowerCase()
      .includes(user.role.toLocaleLowerCase());
    if (!grantAccess) {
      throw new ForbiddenException("Доступ запрещен");
    }
    return user && user.role && grantAccess;
  }
}
