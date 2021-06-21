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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ResetPasswordByEmailDto } from './dto/reset-password-by-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedRequest } from './interfaces/authenticated-request';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in using email and password' })
  @ApiResponse({
    status: 200,
    description: 'The client has successfully authenticated.',
  })
  @ApiResponse({
    status: 400,
    description: `The client's attempt to authenticate was unsuccessful.`,
  })
  signIn(
    @Req()
    req: Request & { user: Pick<AuthenticatedRequest['user'], 'accessToken'> },
    @Res({ passthrough: true }) res: Response,
    @Body() {}: CredentialsDto,
  ) {
    res.cookie('accessToken', req.user.accessToken, { httpOnly: true });
    return { accessToken: req.user.accessToken };
  }

  @Post('sign-up')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({
    status: 200,
    description: 'The account was successfully registered.',
  })
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
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sign out of an account' })
  @ApiResponse({
    status: 200,
    description: 'The client has successfully signed out.',
  })
  async signOut(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.user.accessToken;
    const { error } = await this.auth.signOut(token);
    if (error) {
      throw new InternalServerErrorException();
    }
    res.clearCookie('accessToken');
    return { message: 'User signed out.' };
  }

  @Post('reset-password-by-email')
  @HttpCode(202)
  @ApiOperation({ summary: 'Request a password reset for an email' })
  @ApiResponse({
    status: 202,
    description:
      'The password reset request has been received. If the email belongs to a user, they will recieve instructions on how to reset their password.',
  })
  async resetPasswordByEmail(@Body() { email }: ResetPasswordByEmailDto) {
    this.auth.resetPasswordByEmail(email);
    return { message: 'Request received.' };
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset a password by using a password reset token' })
  @ApiResponse({
    status: 200,
    description: 'The password has been successfully changed',
  })
  @ApiResponse({ status: 401, description: 'The provided token was invalid.' })
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    const { error } = await this.auth.resetPassword(token, newPassword);
    if ((error as any)?.status === 401) {
      throw new UnauthorizedException(undefined, error?.message);
    }
    return { message: 'Password changed' };
  }
}
