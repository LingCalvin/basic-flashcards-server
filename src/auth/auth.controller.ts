import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ResetPasswordByEmailDto } from './dto/reset-password-by-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import * as JwtUtils from './utils/jwt.utils';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  signIn(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body() {}: CredentialsDto,
  ) {
    res.cookie('accessToken', req.user.accessToken, { httpOnly: true });
    return { accessToken: req.user.accessToken };
  }

  @Post('sign-up')
  async signUp(@Body() { email, password }: CredentialsDto) {
    const { error } = await this.auth.signUp(email, password);

    if (!error) {
      return { message: 'User registered.' };
    }
    if ((error as any)?.status === 400) {
      throw new BadRequestException(undefined, error.message);
    }
    throw new InternalServerErrorException();
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = JwtUtils.extractFromRequest(req);
    const { error } = await this.auth.signOut(token);
    if (error) {
      throw new InternalServerErrorException();
    }
    res.clearCookie('accessToken');
    return { message: 'User signed out.' };
  }

  @Post('reset-password-by-email')
  @HttpCode(202)
  async resetPasswordByEmail(@Body() { email }: ResetPasswordByEmailDto) {
    this.auth.resetPasswordByEmail(email);
    return { message: 'Request received.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    const { error } = await this.auth.resetPassword(token, newPassword);
    if ((error as any)?.status === 401) {
      throw new UnauthorizedException(undefined, error.message);
    }
    return { message: 'Password changed' };
  }
}