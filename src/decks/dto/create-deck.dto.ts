import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UpdateDeckDto } from './update-deck.dto';

export class CreateDeckDto extends UpdateDeckDto {
  /**
   * The deck's author's ID.
   */
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  authorId: string;
}
