import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(50)
  @Type(() => Number)
  @ApiProperty({ required: false })
  limit = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ required: false })
  offset = 0;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiProperty({ required: false })
  sort: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  orderBy?: string;
}
