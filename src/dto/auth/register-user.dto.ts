import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/entity/users/user.entity';

export class RegisterUserDto extends PickType(UsersModel, [
  'nickname',
  'email',
  'password',
]) {}
