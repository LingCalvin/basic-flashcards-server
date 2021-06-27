import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiSecurity } from '@nestjs/swagger';

export function ApiOptionallyAuthenticatedEndpoint() {
  return applyDecorators(ApiBearerAuth(), ApiCookieAuth(), ApiSecurity({}));
}
