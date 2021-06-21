import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordByEmailDto {
  /**
   * The user's email.
   */
  @IsEmail()
  @ApiProperty({ format: 'email' })
  email: string;
}
