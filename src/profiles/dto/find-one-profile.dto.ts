import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindOneProfileDto {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string;
}
