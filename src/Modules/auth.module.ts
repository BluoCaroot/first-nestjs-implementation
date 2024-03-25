import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthController } from "src/Auth/Controllers";
import { AuthService } from "src/Auth/Services";
import { SendEmailService } from "src/Common/send-email.service";
import { models } from "src/DB/model-generation";


@Module({
    imports: [models],
    controllers: [AuthController],
    providers: [AuthService, SendEmailService, JwtService],
})
export class AuthModule { }