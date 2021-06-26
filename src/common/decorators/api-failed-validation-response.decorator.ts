import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

export function ApiFailedValidationResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'One or more validation rules were not met.',
      schema: {
        type: 'object',
        required: ['statusCode', 'message', 'error'],
        properties: {
          statusCode: {
            description: 'The HTTP response status code',
            enum: [HttpStatus.BAD_REQUEST],
          },
          message: {
            description:
              'An array of messages explaining the failed validation rules.',
            type: 'array',
            items: { type: 'string' },
          },
          error: { description: 'The error.', type: 'string' },
        },
      },
    }),
  );
}
