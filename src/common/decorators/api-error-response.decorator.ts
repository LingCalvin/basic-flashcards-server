import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiErrorResponse(options?: ApiResponseOptions) {
  return applyDecorators(
    ApiResponse({
      status: options?.status,
      description: options?.description,
      schema: {
        type: 'object',
        required: ['statusCode', 'message', 'error'],
        properties: {
          statusCode: {
            description: 'The HTTP response status code',
            type: options?.status === undefined ? 'integer' : undefined,
            enum: options?.status !== undefined ? [options.status] : undefined,
          },
          message: {
            description: 'A message describing the error.',
            type: 'string',
          },
          error: { description: 'The error.', type: 'string' },
        },
      },
    }),
  );
}
