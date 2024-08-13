import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/enum/role.enum';
import { timeStamp } from 'console';


export type UserDocument = User & Document;

@Schema({
    timestamps: true
})

export class User {

    @Prop({ type: String, unique: true })
    @IsNotEmpty()
    username: string 

    @Prop({ type: String })
    @IsNotEmpty()
    password: string

    @Prop({ type: String, unique: [true, 'Duplicate email, please provide another email '] })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Prop({default:'user'})
    roles: Role[];

    @Prop()
    verificationToken: string;

    @Prop({type:Date})
    birthday:string;
}

export const UserSchema = SchemaFactory.createForClass(User);

