import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService : UserService, private readonly jwtService: JwtService){}

        async validateUser(username: string, password: string) : Promise <any>{
            const user = await this.userService.findUser(username);
            if (!user) {
                throw new NotFoundException("User is not found!")
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if(user && isPasswordMatch){
                return user;
            }
            return null;
        };

        async   login(user: any){
            const userForLogin = await this.userService.findUser(user.username);
            const payload = {username: userForLogin.username, roles:userForLogin.roles};
            return{ access_token : this.jwtService.sign(payload)}
        };

        
    
}
