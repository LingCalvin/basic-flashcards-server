import { Request } from 'express';
import { JwtPayload } from './jwt-payload';

export interface OptionallyAuthenticatedRequest extends Request {
  user?: Request['user'] & Partial<JwtPayload & { accessToken: string }>;
}
