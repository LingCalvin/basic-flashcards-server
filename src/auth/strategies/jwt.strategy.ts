import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthenticatedRequest } from '../interfaces/authenticated-request';
import { JwtPayload } from '../interfaces/jwt-payload';
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

  async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<AuthenticatedRequest['user']> {
    const accessToken = JwtUtils.extractFromRequest(req);
    if (
      accessToken === null ||
      (await this.authService.isTokenRevoked(accessToken))
    ) {
      throw new UnauthorizedException();
    }
    return { ...payload, accessToken };
  }
}
