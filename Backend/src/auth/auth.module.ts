import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth.strategy';


@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService : ConfigService) => ({
                secret : configService.get<string>('JWT.AT'),
                signOptions : { expiresIn: configService.get<string>('JWT.EXPAT')}
            })
        })
    ],

    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,],
    exports: [AuthModule]
})
export class AuthModule {}
