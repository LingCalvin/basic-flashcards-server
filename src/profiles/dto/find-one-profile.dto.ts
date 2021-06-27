import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindOneProfileDto {
  /**
   * The ID of the user.
   */
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string;
}
