import { PaginatedResponse } from '../../common/responses/paginated.response';
import { DeckResponse } from './deck.response';

export class FindAllDecksResponse extends PaginatedResponse {
  data: DeckResponse[];
}
