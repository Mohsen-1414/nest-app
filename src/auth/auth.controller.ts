import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/dto/create-user-dto';
import { LocalAuthGuard } from './gaurd/local.guard';
import { JwtAuthGuard } from './gaurd/jwt.guard';
import { RolesGaurd } from './gaurd/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enum/role.enum';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/schema/user.schema';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService){}


    @Post('/register')
    @ApiResponse({ status: 201, description: 'User successfully registered.' })
        async register(@Body() CreateUserDTO: CreateUserDTO): Promise<User>{
            return this.userService.addUser(CreateUserDTO);
        }
    
    @UseGuards(LocalAuthGuard)        
    @Post('/login')
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiBody({ description: 'Credentials for logging in' })
        async login(@Request() req){
            return this.authService.login(req.user)
        };


    
    @UseGuards(JwtAuthGuard, RolesGaurd)
    @Roles(Role.Admin)
    @Get('/me')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Admin profile retrieved successfully.' })
        async getDashboard(@Request() req){
            return req.user;
        };

}
