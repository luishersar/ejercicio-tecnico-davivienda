import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
interface JwtPayload {
  sub: string;
  email: string;
}

interface ValidatedUser {
  userId: string;
  email: string;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
      ignoreExpiration: false,
    });
  }
  validate(payload: JwtPayload): ValidatedUser {
    return { userId: payload.sub, email: payload.email };
  }
}
