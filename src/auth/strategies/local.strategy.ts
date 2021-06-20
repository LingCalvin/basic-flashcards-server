import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const { user, session, error } = await this.authService.validateUser(
      email,
      password,
    );

    if (error) {
      throw new UnauthorizedException(error);
    }
    if (session === null) {
      throw new InternalServerErrorException();
    }
    return { ...user, accessToken: session.access_token };
  }
}
