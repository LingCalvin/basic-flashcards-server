import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

export const extractFromRequest = (req: Request) =>
  ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req: Request) => req.cookies.accessToken,
  ])(req);
