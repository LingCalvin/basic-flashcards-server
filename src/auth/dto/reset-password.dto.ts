import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @Length(8, 256)
  @ApiProperty({ format: 'password' })
  newPassword: string;
}
