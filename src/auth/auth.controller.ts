import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  registerUser(@Body() createUserDto: CreateUserDto){
    return this.authService.registerUser(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  login(@Request() req){
    return this.authService.login(req.user.id,req.user.name)
  }

  @UseGuards(JwtAuthGuard)
  @Get("protected")
  getAll(@Request() req){
    return `You can now access the protected API. this is your user ID: ${req.user.id} and your name is ${req.user.name}`
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req){
    this.authService.refreshToken(req.user.id,req.user.name)
  }
}
