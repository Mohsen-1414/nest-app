import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>){}

    async addUser(createUserDTO: CreateUserDTO): Promise<User> {
        const verificationToken = this.generateVerificationToken();
        const newUser = await this.userModel.create({ ...createUserDTO, verificationToken });
        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();

        await this.sendVerificationEmail(newUser.email, newUser.verificationToken);

        return newUser;
    }

    async findUser(username: string): Promise<User> {
        return await this.userModel.findOne({ username: username });
    }

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

    private generateVerificationToken(): string {
        return Math.random().toString(36).substr(2);
    }
}