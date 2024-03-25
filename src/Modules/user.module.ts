import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from 'src/Common/send-email.service';
import { models } from 'src/DB/model-generation';
import { UserController } from 'src/User/Controllers';
import { UserService } from 'src/User/Services';

@Module(
{
    imports: [models],
    controllers: [UserController],
    providers: [UserService, JwtService, SendEmailService]
})
export class UserModule { }