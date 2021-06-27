import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CredentialsDto {
  /**
   * The user's email.
   */
  @IsEmail()
  @ApiProperty({ format: 'email' })
  email: string;
  /**
   * The user's password.
   */
  @IsString()
  @Length(8, 256)
  @ApiProperty({ format: 'password' })
  password: string;
}
