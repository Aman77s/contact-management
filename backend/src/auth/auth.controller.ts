import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './Dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './Dto/user-login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,){}


    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({ type: CreateUserDto })
    register(@Body() user: CreateUserDto){
        return this.authService.register(user)
    }

    @Post('login')
    login(@Body() loginDto:LoginUserDto ){
        return this.authService.login(loginDto)
    }

    
}
