import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from "src/users/users.service";

interface Payload {
    _id         : string,
    userName    : string,
    email       : string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
      ) 
    {
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : configService.get<string>('JWT.AT')
        });
    }

    async validate(payload : Payload){
        const user = await this.usersService.findByEmail(payload.email);
        if (!user) throw new Error('User Token not found!');
        return user;
    }
    


}
