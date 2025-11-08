import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from './services/users.service';

@Injectable()
export class AuthService {
  private accessSecret = process.env.JWT_ACCESS_SECRET!;
  private accessTtl = Number(process.env.ACCESS_TTL_SEC || 900);

  constructor(private users: UsersService) {}

  login(dto: LoginDto) {
    const user = this.users.validateUser(dto.email, dto.password);
    if (!user) return { ok: false, message: 'Invalid credentials' };

    const access = this.signAccessToken(user.id, user.email);

    return {
      ok: true,
      accessToken: access,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  signAccessToken(sub: number, email: string) {
    return jwt.sign({ sub, email }, this.accessSecret, {
      expiresIn: this.accessTtl,
    });
  }
}
