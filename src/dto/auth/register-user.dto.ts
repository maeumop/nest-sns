import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/entity/users/users.entity';

export class RegisterUserDto extends PickType(UsersModel, [
  'nickname',
  'email',
  'password',
]) {}
