import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  /**
   * The maximum number of results to return.
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  @ApiPropertyOptional({ type: 'integer' })
  limit = 10;

  /**
   * How many limits of results to skip.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ type: 'integer' })
  offset = 0;

  /**
   * Whether to sort the results ascending or descending based on `orderBy`.
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional({ type: 'string', enum: ['asc', 'desc'] })
  sort: 'asc' | 'desc' = 'desc';

  /**
   * The field to order the results by.
   */
  @IsOptional()
  @IsString()
  orderBy?: string;
}
