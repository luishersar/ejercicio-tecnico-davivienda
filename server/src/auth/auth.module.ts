import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from './strategies/jwt-auth.strategy';
import { UsersService } from './services/users.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt-auth' })],
  providers: [AuthService, JwtAccessStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
