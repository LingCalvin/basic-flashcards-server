import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ApiAuthenticatedEndpoint } from '../common/decorators/api-authenticated-endpoint.decorator';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiFailedValidationResponse } from '../common/decorators/api-failed-validation-response.decorator';
import { MessageResponse } from '../common/responses/message.response';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ResetPasswordByEmailDto } from './dto/reset-password-by-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedRequest } from './interfaces/authenticated-request';
import { SignInResponse } from './responses/sign-in.response';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in using email and password' })
  @ApiOkResponse({
    description: 'The client has successfully authenticated.',
    type: SignInResponse,
  })
  @ApiBadRequestResponse({
    description: `The client's attempt to authenticate was unsuccessful.`,
    schema: {
      type: 'object',
      required: ['status', 'message'],
      properties: {
        status: {
          description: 'The HTTP response status code.',
          enum: [HttpStatus.BAD_REQUEST],
        },
        message: {
          description:
            'A message describing why the authentication attempt was unsuccessful.',
          type: 'string',
        },
      },
    },
  })
  signIn(
    @Req()
    req: Request & { user: Pick<AuthenticatedRequest['user'], 'accessToken'> },
    @Res({ passthrough: true }) res: Response,
    @Body() {}: CredentialsDto,
  ): SignInResponse {
    res.cookie('accessToken', req.user.accessToken, { httpOnly: true });
    return { accessToken: req.user.accessToken };
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new account' })
  @ApiOkResponse({
    description: 'The account was successfully registered.',
    type: MessageResponse,
  })
  @ApiFailedValidationResponse()
  async signUp(
    @Body() { email, password }: CredentialsDto,
  ): Promise<MessageResponse> {
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint()
  @ApiOperation({ summary: 'Sign out of an account' })
  @ApiOkResponse({
    description: 'The client has successfully signed out.',
    type: MessageResponse,
  })
  async signOut(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponse> {
    const token = req.user.accessToken;
    const { error } = await this.auth.signOut(token);
    if (error) {
      throw new InternalServerErrorException();
    }
    res.clearCookie('accessToken');
    return { message: 'User signed out.' };
  }

  @Post('reset-password-by-email')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Request a password reset for an email' })
  @ApiAcceptedResponse({
    description:
      'The password reset request has been received. If the email belongs to a user, they will receive instructions on how to reset their password.',
    type: MessageResponse,
  })
  @ApiFailedValidationResponse()
  async resetPasswordByEmail(
    @Body() { email }: ResetPasswordByEmailDto,
  ): Promise<MessageResponse> {
    this.auth.resetPasswordByEmail(email);
    return { message: 'Request received.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset a password by using a password reset token' })
  @ApiOkResponse({
    description: 'The password has been successfully changed',
    type: MessageResponse,
  })
  @ApiFailedValidationResponse()
  @ApiErrorResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The provided token was invalid.',
  })
  async resetPassword(
    @Body() { token, newPassword }: ResetPasswordDto,
  ): Promise<MessageResponse> {
    const { error } = await this.auth.resetPassword(token, newPassword);
    if ((error as any)?.status === 401) {
      throw new UnauthorizedException(undefined, error?.message);
    }
    return { message: 'Password changed' };
  }
}
