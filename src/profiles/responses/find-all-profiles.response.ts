import { PaginatedResponse } from '../../common/responses/paginated.response';
import { ProfileResponse } from './profile.response';

export class FindAllProfilesResponse extends PaginatedResponse {
  data: ProfileResponse[];
}
