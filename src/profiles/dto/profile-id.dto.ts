import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ProfileIdDto {
  /**
   * The ID of the user.
   */
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string;
}
