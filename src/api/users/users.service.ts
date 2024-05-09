import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from '../../entity/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRespository: Repository<UsersModel>,
  ) {}

  async createUser({
    nickname,
    email,
    password,
  }: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    // nickname 중복 확인
    const nickExists = await this.usersRespository.exists({
      where: { nickname },
    });

    if (nickExists) {
      throw new BadRequestException('이미 존재하는 닉네임 입니다!');
    }

    const emailExists = await this.usersRespository.exists({
      where: { email },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일 입니다!');
    }

    const userObj = await this.usersRespository.create({
      nickname,
      email,
      password,
    });

    const newUser = await this.usersRespository.save(userObj);

    return newUser;
  }

  async getAllUsers() {
    return this.usersRespository.find();
  }

  async getUserByEmail(email: string) {
    return await this.usersRespository.findOne({
      where: {
        email,
      },
    });
  }
}
