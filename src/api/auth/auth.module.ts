import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/api/users/users.module';

@Module({
  // dependenies error 발생시 확인
  imports: [JwtModule.register({}), UsersModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
