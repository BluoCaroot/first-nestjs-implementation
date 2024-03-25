import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/schemas/user.schema";

@Injectable()
export class AuthGuard implements CanActivate
{
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }
    async canActivate(
        context: ExecutionContext
    ): Promise<object>
    {
        const req = context.switchToHttp().getRequest();

        const { accesstoken } = req.headers
        if (!accesstoken) {
            throw new BadRequestException('pleaee lognIn first')
        }
        if (!accesstoken.startsWith('nest__')) {
            throw new BadRequestException('wrong prefix')
        }
        const token = accesstoken.split('__')[1]

        const decodedData = this.jwtService.verify(token, { secret: process.env.LOGIN_SECRET })
        if (!decodedData._id) {
            throw new BadRequestException('wrong token')
        }
        const user = await this.userModel.findById(decodedData._id, 'email name role')
        if (!user) {
            throw new BadRequestException('please signup first')
        }
        req['authUser'] = user
        return req
    }
}