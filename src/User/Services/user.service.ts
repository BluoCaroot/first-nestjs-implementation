import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/schemas/user.schema';
import { Request } from "express";
import { SendEmailService } from 'src/Common/send-email.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService
{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly sendEmailService: SendEmailService,
        private readonly jwtService: JwtService
    ){}

    async updateUser(req: Request)
    {
        const {name, email, password} = req.body;

        if (email)
        {
            const isEmailExists = await this.userModel.findOne({ email })
            if (isEmailExists) 
                throw new ConflictException('Email already exists');
            
            const token = this.jwtService.sign({ email }, { secret: process.env.EMAIL_SECRET });
            const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirm-email/${token}`
            const isEmailSent = await this.sendEmailService.sendEmail(
                email,
                'Update your email',
                `<h1>Click on the link to confirm your email</h1>
                <a href="${confirmationLink}">Confirm Email</a>`
            );
            if (!isEmailSent) 
                throw new InternalServerErrorException('failed to update');
        }
        const hashedPassword = password ? bcrypt.hashSync(password, +process.env.SALT_ROUNDS) : null
        const user = await this.userModel.findByIdAndUpdate(req['authUser']._id, {
            name,
            email,
            password: hashedPassword
        }, {new: true})
        if (!user)
            throw new InternalServerErrorException('failed to update');
        return user;
    }

    async deleteUser(req : Request)
    {
        const user = await this.userModel.findByIdAndDelete(req['authUser']._id)
        if (!user)
            throw new InternalServerErrorException('failed to delete');
        return user;
    }

    async getUser(req: Request)
    {
        const user = await this.userModel.findById(req['authUser']._id)
        if (!user)
            throw new InternalServerErrorException('failed to get user');
        return user;
    }
}