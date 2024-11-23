import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: "email" });
    }

    async validate(
        email: string,
        password: string,
        done: (error: any, user: any) => void,
    ): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            return done(UnauthorizedException, null);
        }
        return done(null, user);
    }
}
