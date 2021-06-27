import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

const allowedOrderBy: FindAllProfilesDto['orderBy'][] = ['id', 'username'];
export class FindAllProfilesDto extends PaginationDto {
  @IsOptional()
  @IsIn(allowedOrderBy)
  @ApiPropertyOptional({ enum: allowedOrderBy })
  orderBy: 'id' | 'username' = 'username';
  /**
   * The ID or one of the IDs the results must have.
   */
  @IsOptional()
  @IsUUID(undefined, { each: true })
  @ApiProperty({ type: [String] })
  id?: string | string[];
  /**
   * The username or one of the usernames the results must have.
   */
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ type: [String] })
  username?: string | string[];
  /**
   * What the username of each result must start with.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  usernameStartsWith?: string;
}
