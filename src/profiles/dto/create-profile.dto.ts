import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

export class CreateProfileDto extends UpdateProfileDto {
  /**
   * The ID of the user.
   */
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  userId: string;
}
