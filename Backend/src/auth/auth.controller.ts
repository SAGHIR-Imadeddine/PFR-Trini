import { Controller, Post, Body, Res, BadRequestException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { Public } from './public.decorator';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService : AuthService
    ){}
    
    @Post('register')
    @Public()
    async register(@Body() registerdto : RegisterDto, @Res() res : Response){ 
        try {
            const { accessToken, refreshToken } = await this.authService.register(registerdto);
            
            res.cookie('refresh_token', refreshToken, {
                httpOnly : true,
                maxAge : 2 * 24 * 60 * 60 * 1000,
                path : '/'
            });
            
            return res.status(200).json({accessToken : accessToken}) ;
        } catch (error) {
            throw new BadRequestException('failed to login', error.message);
        }
    }

    @Post('login')
    @Public()
    async login(@Body() logindto : loginDto, @Res() res : Response){
        const {email, password} = logindto;
        try {
            const { accessToken, refreshToken } = await this.authService.login(email, password);

            res.cookie('refresh_token', refreshToken, {
                httpOnly : true,
                maxAge : 2 * 24 * 60 * 60 * 1000,
                path : '/'
            });
            
            return res.status(200).json({accessToken});
        } catch (error) {
            throw new BadRequestException('failed to login', error.message);
        }
    }

    @Post('refresh')
    async refresh(@Req() req : Request, @Res() res : Response){

        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) throw new BadRequestException('session expired!');

        const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
        return res.status(200).json({...newAccessToken});
    }

    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('refresh_token', { path: '/' });
        return res.status(200).json({ message: 'Logged out successfully' });
    }

}
