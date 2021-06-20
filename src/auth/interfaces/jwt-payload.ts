export interface JwtPayload {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  app_metadata: {
    provider: string;
  };
  role: string;
}
