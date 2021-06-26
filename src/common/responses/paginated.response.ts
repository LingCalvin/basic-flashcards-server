import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse {
  /**
   * How many results in total match the given filter.
   */
  @ApiProperty({ format: 'integer' })
  count: number;
  /**
   * One page of results based on the given filter.
   */
  data: any[];
}
