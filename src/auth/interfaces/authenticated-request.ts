import { Request } from 'express';
import { JwtPayload } from './jwt-payload';

export interface AuthenticatedRequest extends Request {
  user: Request['user'] & JwtPayload & { accessToken: string };
}
