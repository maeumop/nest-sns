import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/decorator/users/role.decorator';
import { UserRole } from 'src/types/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Exclude Annotation을 달고 있는 컬럼을 제외하고 호출한다
   * UserModel이 직렬화(json) 될 때 해당 컬럼을 제외한다.
   */
  @Get()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
