import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllDecksDto extends PaginationDto {
  @IsOptional()
  @IsIn(['title'])
  @ApiPropertyOptional()
  orderBy: 'title' = 'title';
  /**
   * The ID or IDs that the results must have.
   */
  @IsOptional()
  @IsUUID(undefined, { each: true })
  @ApiProperty({ type: [String] })
  id?: string | string[];
  /**
   * The title or one of the titles the match must have.
   * @example ['Spanish', 'Spanish V']
   */
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ type: [String] })
  title?: string | string[];
  /**
   * What the title of each result must start with.
   * @example 'Spanish'
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titleStartsWith?: string;
  /**
   * Whether the search should be case sensitive or not.
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => !['0', 0, 'false', false].includes(value))
  @ApiPropertyOptional({ type: 'boolean' })
  caseSensitive = false;
}
