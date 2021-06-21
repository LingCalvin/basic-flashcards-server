import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  /**
   * The token for resetting a password.
   */
  @IsString()
  token: string;
  /**
   * The new password.
   */
  @IsString()
  @Length(8, 256)
  @ApiProperty({ format: 'password' })
  newPassword: string;
}
