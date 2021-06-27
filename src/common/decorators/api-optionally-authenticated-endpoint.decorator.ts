import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiSecurity } from '@nestjs/swagger';

/**
 * Annotates that an endpoint accepts authentication, but that it is not
 * required.
 */
export function ApiOptionallyAuthenticatedEndpoint() {
  return applyDecorators(ApiBearerAuth(), ApiCookieAuth(), ApiSecurity({}));
}
