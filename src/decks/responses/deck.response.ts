import { ApiProperty } from '@nestjs/swagger';
import { definitions } from '../../supabase/interfaces/supabase';
import { CreateCardDto } from '../dto/create-card.dto';

const allowedVisibilities: definitions['decks']['visibility'][] = [
  'private',
  'public',
];

export class DeckResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  authorId: string;

  title: string;

  description: string;

  @ApiProperty({ enum: allowedVisibilities, required: false })
  visibility: definitions['decks']['visibility'] = 'private';

  cards: CreateCardDto[];

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}
