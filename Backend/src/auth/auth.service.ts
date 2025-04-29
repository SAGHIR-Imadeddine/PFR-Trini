import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

interface Token{
    accessToken?  : string,
    refreshToken? : string,
}

@Injectable()
export class AuthService {
    
    constructor(
        private readonly jwtService : JwtService,
        private readonly userService : UsersService,
        private readonly configService : ConfigService,
    ){}

    async register(user : User) : Promise<Token>{

        try {
            if (await this.userService.findByEmail(user.email)) throw new BadRequestException('email already exists!');
            const registered = await this.userService.create(user);
            if (!registered) throw new BadRequestException('failed to register');

            const accessToken = await this.generateToken(registered);
            const refreshToken = await this.generateRefreshToken(registered);
            
            return {...accessToken, ...refreshToken};
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }

    async login(email: string, password: string) : Promise<Token>{

        const user = await this.userService.findByEmail(email);

        if (!user) throw new BadRequestException('can\'t find email');
        if (!await bcrypt.compare(password, (user.password))) throw new UnauthorizedException('invalid passord!');
        
        const accessToken = await this.generateToken(user);
        const refreshToken = await this.generateRefreshToken(user);

        return {...accessToken, ...refreshToken}
    }

    private async generateToken(user : UserDocument) : Promise<Token>{
        const payload = {
            id          : user._id,
            name        : user.name,
            email       : user.email,
            role        : user.role,
            gyms        : user.gyms
        }
        const token = await this.jwtService.signAsync(payload)
        return {accessToken : token};
    }

    private async generateRefreshToken(user : UserDocument) : Promise<Token>{
        const payload = {
            id          : user._id,
            name        : user.name,
            email       : user.email,
            role        : user.role,
            gyms        : user.gyms
        }
        const token = await this.jwtService.signAsync(payload, {
            secret : this.configService.get<string>('JWT.RT'),
            expiresIn : this.configService.get<string>('JWT.EXPRT')
        })
        
        return {refreshToken : token};
    }

    async refreshAccessToken(refreshToken: string) : Promise<Token> {
        try {            
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT.RT'),
            });
            
            const user = await this.userService.findByEmail(decoded.email);
            if (!user) throw new UnauthorizedException('user does not match!');
            const token = await this.generateToken(user)
            return  token;

        } catch (error) {
            throw new UnauthorizedException('Refresh token expired or invalid', error)
        }
    }
}


