import {  Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {


    async sendEmail(
        to: string | string[],
        subject: string,
        message: string,
        attachments?: [],
    ) 
    {
        const transporter = nodemailer.createTransport(
        {
            host: 'localhost',
            port: 587,
            secure: false,
            service: 'gmail',
            auth: 
            {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        })

        const emailInfo = await transporter.sendMail(
        {
            from: '"no-reply" ' + `${process.env.EMAIL}`,
            to: to ? to : '',
            subject: subject ? subject : 'Hello',
            html: message ? message : '',
            attachments
        })
        if (emailInfo.accepted.length) 
            return true
        return false
    }
}