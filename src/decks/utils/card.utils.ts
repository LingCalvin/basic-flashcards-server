import { Card } from '../../supabase/interfaces/card.interface';
import { CreateCardDto } from '../dto/create-card.dto';

/**
 * Converts the properties of a `CreateCardDto` object to the properties of a
 * `Card` object.
 *
 * @remarks
 * This function does not mutate the `card` argument.
 *
 * @param card - The card to create a `Card` object from
 * @returns A `Card` objects whose properties correspond to `card`
 */
export function convertToCard({ frontText, backText }: CreateCardDto): Card {
  return { front_text: frontText, back_text: backText };
}
