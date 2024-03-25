import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {User} from '../../DB/schemas/user.schema'
import { ConflictException,
    InternalServerErrorException,
    NotFoundException} from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { SendEmailService } from "src/Common/send-email.service";
import { JwtService } from "@nestjs/jwt"
import { Request } from "express";

@Injectable()
export class AuthService
{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private sendEmailService: SendEmailService,
        private jwtService: JwtService
    ) { }
    
    
    async signUpService(req: Request) 
    {

        const { name, email, password } = req.body;

        const isEmailExists = await this.userModel.findOne({ email })
        if (isEmailExists) 
            throw new ConflictException('Email already exists');

        const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)

        const token = this.jwtService.sign({ email }, { secret: process.env.EMAIL_SECRET });
        const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirm-email/${token}`
        const isEmailSent = await this.sendEmailService.sendEmail(
            email,
            'Welcome to our app',
            `<h1>Click on the link to confirm your email</h1>
            <a href="${confirmationLink}">Confirm Email</a>`
        );
        if (!isEmailSent) 
            throw new InternalServerErrorException('Email not sent');
        
        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword
        })
        if (!user)
            throw new InternalServerErrorException('User not created');
        
        return user;
    }
    async loginService(req: Request)
    {
        const { email, password } = req.body;
        const user = await this.userModel.findOne({ email, isEmailVerified: true});
        if (!user)
            throw new NotFoundException('invalid credentials');
        const isPasswordMatched = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatched)
            throw new NotFoundException('invalid credentials');
        const token = this.jwtService.sign(
            { email, _id: user._id }, 
            { secret: process.env.LOGIN_SECRET, expiresIn: '1h' });
        return 'nest__' + token;
    }

    async confirmEmailService(req: Request)
    {
        const token = req.params.token;
        const decodedToken = this.jwtService.verify(token, { secret: process.env.EMAIL_SECRET });
        const email = decodedToken.email;
        const user = await this.userModel.findOneAndUpdate
        (
            { email },
            { isEmailVerified: true},
            { new: true }
        );
        if (!user)
            throw new NotFoundException('User not found');
        return user;
    }
}