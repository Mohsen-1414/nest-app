import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from './schema/user.schema'
import { EmailService } from './email.service';

@Module({
  imports:[MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
