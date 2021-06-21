import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeckIdDto {
  /**
   * The ID of the deck.
   */
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string;
}
