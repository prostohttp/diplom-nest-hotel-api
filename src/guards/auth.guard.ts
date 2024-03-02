import { Injectable } from "@nestjs/common";
import { AuthGuard as AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}
