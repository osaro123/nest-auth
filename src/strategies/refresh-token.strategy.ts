import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "src/auth/auth.service";
import refreshConfig from "src/auth/config/refresh.config";
import { AuthJwtPayload } from "src/auth/types/auth-jwtPayload";


@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy,"refresh-jwt"){
    constructor(
        @Inject(refreshConfig.KEY)
        private readonly refreshTokenConifg: ConfigType<typeof refreshConfig>,
        private readonly authService: AuthService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
            secretOrKey: refreshTokenConifg.secret,
            ignoreExpiration: false
        })
    }

    validate(payload: AuthJwtPayload){
        const userId = payload.sub
        return this.authService.validateRefreshToken(userId)
    }
}