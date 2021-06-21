import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { definitions } from '../../supabase/interfaces/supabase';
import {
  descriptionMaxLength,
  descriptionMinLength,
  titleMaxLength,
  titleMinLength,
} from '../constants/limits';
import { CreateCardDto } from './create-card.dto';

const allowedVisibilities: definitions['decks']['visibility'][] = [
  'private',
  'public',
];

export class UpdateDeckDto {
  /**
   * The title of the deck.
   * @example 'Beginner Spanish'
   */
  @IsString()
  @Length(titleMinLength, titleMaxLength)
  title: string;
  /**
   * The deck's description.
   * @example 'The basic Spanish phrases that every beginner should know.'
   */
  @IsString()
  @Length(descriptionMinLength, descriptionMaxLength)
  description: string;
  /**
   * Whether the deck is publicly viewable or only viewable by the author.
   */
  @IsOptional()
  @IsString()
  @IsIn(allowedVisibilities)
  @ApiProperty({ enum: allowedVisibilities, required: false })
  visibility: definitions['decks']['visibility'] = 'private';
  /**
   * The cards in the deck.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  cards: CreateCardDto[];
}
