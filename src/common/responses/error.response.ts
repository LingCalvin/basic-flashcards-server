import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  /**
   * The HTTP response status code.
   */
  @ApiProperty({ format: 'integer' })
  statusCode: number;
  /**
   * A message explaining the error.
   */
  message: string | string[];
  /**
   * The error.
   */
  error: string;
}
