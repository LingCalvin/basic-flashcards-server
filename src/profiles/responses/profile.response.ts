import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;
  username: string;
}
