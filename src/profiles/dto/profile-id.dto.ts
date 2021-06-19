import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ProfileIdDto {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string;
}
