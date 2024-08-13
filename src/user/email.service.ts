import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';



@Injectable()

export class EmailService {

    async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 587, 
            secure: false, 
            auth: {
                user: 'sm.shafaei@gmail.com',
                pass: 'infe emve egyb jzcz  ',
            },  
        });

        const mailOptions = {
            from: 'sm.shafaei@gmail.com',
            to: email,
            subject: 'Verify your email',
            html: `<p>Please click the following link to verify your email: <a href="http://localhost:3000/auth/verify/${verificationToken}">Verify</a></p>`,
        };

        await transporter.sendMail(mailOptions);
    }


}