import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './Dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './Dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService
    
){}

    async register(userDto : CreateUserDto){
        const hashpassword = await bcrypt.hash(userDto.password, 10)
        const user = this.usersRepo.create({
            username: userDto.username,
            email : userDto.email,
            password: hashpassword
         })
        await this.usersRepo.save(user);
        return "User Register Scuessfully"
    }

    async login(loginDto : LoginUserDto){
        const {email , password} = loginDto
        const user = await this.usersRepo.findOne({where: {email}});

        if (!user){
            throw new UnauthorizedException("Invalid Email Address")
        }

        const ismatch = await bcrypt.compare(password, user.password)

        if (!ismatch){
            throw new UnauthorizedException("Invalid Password ")
        }

        const payload = {sub: user.id, email: user.email};
        const token = this.jwtService.sign(payload, {secret: 'jwt_secret', expiresIn: '1h'});
        return {
            message: "Login Scuessfully",
            access_token : token
        }


    }



}
