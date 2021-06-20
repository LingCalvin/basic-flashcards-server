import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllProfilesDto extends PaginationDto {
  @IsOptional()
  @IsIn(['id', 'username'])
  @ApiProperty({ type: 'string', required: false })
  orderBy: 'id' | 'username' = 'username';

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    oneOf: [
      { type: 'string', format: 'uuid' },
      { type: 'array', items: { type: 'string', format: 'uuid' } },
    ],
  })
  id?: string | string[];

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string', format: 'uuid' } },
    ],
  })
  username?: string | string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  usernameStartsWith?: string;
}
