import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/dto/create-user-dto';
import { LocalAuthGuard } from './gaurd/local.guard';
import { JwtAuthGuard } from './gaurd/jwt.guard';
import { RolesGaurd } from './gaurd/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enum/role.enum';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService){}


    @Post('/register')
        async register(@Body() CreateUserDTO: CreateUserDTO){
            const user = await this.userService.addUser(CreateUserDTO);
            return user
        }
    
    @UseGuards(LocalAuthGuard)        
    @Post('/login')
        async login(@Request() req){
            return this.authService.login(req.user)
        };


    @UseGuards(JwtAuthGuard, RolesGaurd)
    @Roles(Role.User)
    @Get('/user')
        async getProfile(@Request() req){
            console.log('I am here ');
            return req.user;
        };


    
    @UseGuards(JwtAuthGuard, RolesGaurd)
    @Roles(Role.Admin)
    @Get('/admin')
        async getDashboard(@Request() req){
            return req.user;
        };

}
