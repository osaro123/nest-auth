import { ConflictException, Inject, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(refreshConfig.KEY)
        private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>
    ){}

    async registerUser(createUserDto: CreateUserDto){
        const user = await this.usersService.findByEmail(createUserDto.email)
        if(user) throw new ConflictException("User already exist")
        return this.usersService.create(createUserDto)
    }

    async validateLocalUser(email: string, password: string){
        const user = await this.usersService.findByEmail(email)
        if(!user) throw new UnauthorizedException("User doesn't exist")
        const passwordMatch = await verify(user.password,password)
        if(!passwordMatch) throw new UnauthorizedException("Invalid Credentials")

        return {id: user.id, name: user.name}
    }

    async login(userId: number, name: string){
        const {accessToken,refreshToken} = await this.generateTokens(userId)

        return {
            id: userId,
            name,
            accessToken,
            refreshToken
        }
    }

    async generateTokens(userId: number){
        const payload = {sub: userId}
        const [accessToken,refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload,this.refreshTokenConfig)
        ])

        return {
            accessToken,
            refreshToken
        }
    }

    async validateJwtUser(userId: number){
        const user = await this.usersService.findOne(userId)
        if(!user) throw new UnauthorizedException("User not found")
        const currentUser = {id: user.id}
        return currentUser
    }

    async validateRefreshToken(userId: number){
        const user = await this.usersService.findOne(userId)
        if(!user) throw new UnauthorizedException("User not found")
        const currentUser = {id: user.id}
        return currentUser
    }

    async refreshToken(userId: number,name: string){
        const {accessToken,refreshToken} = await this.generateTokens(userId)

        return {
            id: userId,
            name,
            accessToken,
            refreshToken
        }
    }
}
