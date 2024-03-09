import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { UserRoles } from "src/types/user-roles";

@Injectable()
export class IsManagerOrClient implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.role === UserRoles.Client || user.role === UserRoles.Manager) {
      return true;
    }
    throw new ForbiddenException("Доступ запрещен, вы не менеджер или клиент");
  }
}
