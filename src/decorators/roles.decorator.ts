import { Reflector } from "@nestjs/core";
import { UserRoles } from "src/types/user-roles";

export const Roles = Reflector.createDecorator<UserRoles[]>();
