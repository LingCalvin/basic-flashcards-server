import { IsString, Length } from 'class-validator';
import { cardTextMaxLength, cardTextMinLength } from '../constants/limits';

export class CreateCardDto {
  /**
   * The text on the front of the card.
   */
  @IsString()
  @Length(cardTextMinLength, cardTextMaxLength)
  frontText: string;

  /**
   * The text on the back of the card.
   */
  @IsString()
  @Length(cardTextMinLength, cardTextMaxLength)
  backText: string;
}
