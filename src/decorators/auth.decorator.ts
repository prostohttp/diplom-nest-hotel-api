import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";
import { IsAuthenticatedGuard } from "src/guards/is-authenticated.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { UserRoles } from "src/types/user-roles";

export function Auth(...roles: UserRoles[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(IsAuthenticatedGuard, RolesGuard),
    ApiUnauthorizedResponse({ description: "Вы не авторизованы" }),
  );
}
