import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import * as JwtUtils from '../utils/jwt.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private config: ConfigService) {
    super({
      jwtFromRequest: JwtUtils.extractFromRequest,
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = JwtUtils.extractFromRequest(req);
    if (await this.authService.isTokenRevoked(token)) {
      throw new UnauthorizedException();
    }
    return { ...payload, token };
  }
}
