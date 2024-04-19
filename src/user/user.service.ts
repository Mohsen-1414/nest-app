import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        private readonly emailService: EmailService
    ){}

    async addUser(createUserDTO: CreateUserDTO): Promise<User> {
        const verificationToken = this.generateVerificationToken();
        const newUser = await this.userModel.create({ ...createUserDTO, verificationToken });
        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();

        await this.emailService.sendVerificationEmail(newUser.email, newUser.verificationToken);

        return newUser;
    }

    async findUser(username: string): Promise<User> {
        return await this.userModel.findOne({ username: username });
    }


    // I had to put it here because i wanted to be private to be more secure  
    private generateVerificationToken(): string {
        return Math.random().toString(36).substr(2);
    }
}