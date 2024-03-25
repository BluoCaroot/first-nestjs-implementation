import { Controller, Post, Req, Res, Get, Patch} from '@nestjs/common';
import { AuthService } from '../Services';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController
{
    constructor(
        private readonly authService: AuthService
    ) { }


    @Post('signup')
    async signUpController(
        @Req() req: Request,
        @Res() res: Response
    )
    {
        const user = await this.authService.signUpService(req)
        res.status(201).json({message: "success", data: user})
    }

    @Post('login')
    async loginController(
        @Req() req: Request,
        @Res() res: Response
    ) 
    {
        const token = await this.authService.loginService(req);
        res.status(200).json(
        {
            message: 'User logged in successfully',
            data: token
        });
    }
    @Get('confirm-email/:token')
    async confirmEmailController(
        @Req() req: Request,
        @Res() res: Response
    )
    {
        const user = await this.authService.confirmEmailService(req);
        res.status(200).json({message: 'Email confirmed', data: user});
    }
}
