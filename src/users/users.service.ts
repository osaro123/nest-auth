import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ){}

  async create(createUserDto: CreateUserDto) {
    const {password, ...user} = createUserDto
    const hashedPassword = await hash(password)
    return await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword
      }
    })
  }

  async findByEmail(email: string){
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async findOne(id: number){
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }
  
}
