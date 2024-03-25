import { Controller, Put, Req, Res, Delete, Get, UseGuards } from '@nestjs/common';
import {Request, Response} from 'express'
import { AuthGuard } from 'src/Guards';
import { UserService } from '../Services';
@Controller('user')
export class UserController 
{
    constructor(
        private readonly userService: UserService
        
    ) { }

    @Put()
    @UseGuards(AuthGuard)
    async updateUser(
        @Req() req: Request,
        @Res() res: Response
    )
    {
        const user = await this.userService.updateUser(req);
        res.status(200).json({message: "user updated successfully", data: user})
    }
    @Delete()
    @UseGuards(AuthGuard)
    async deleteUser(
        @Req() req: Request,
        @Res() res: Response
    )
    {
        const user = await this.userService.deleteUser(req);
        res.status(200).json({message: "user deleted successfully", data: user})
    }
    @Get()
    @UseGuards(AuthGuard)
    async getUser(
        @Req() req: Request,
        @Res() res: Response
    )
    {
        const user = await this.userService.getUser(req);
        res.status(200).json({message: "user profile", data: user})
    }
}