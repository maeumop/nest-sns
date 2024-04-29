import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  /**
   * Exclude Annotation을 달고 있는 컬럼을 제외하고 호출한다
   * UserModel이 직렬화(json) 될 때 해당 컬럼을 제외한다.
   */
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
