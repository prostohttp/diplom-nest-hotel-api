import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common";

@Injectable()
export class IsNotAuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.isAuthenticated()) {
            throw new BadRequestException(
                "Вы уже авторизовались, вам необходимо сначала выйти",
            );
        }
        return !request.isAuthenticated();
    }
}
