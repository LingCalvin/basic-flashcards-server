import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from 'src/supabase/classes/supabase-client';
import * as argon2 from 'argon2';
import { definitions } from 'src/supabase/interfaces/supabase';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SupabaseClient) private supabase: SupabaseClient,
    private jwt: JwtService,
  ) {}

  validateUser(email: string, password: string) {
    return this.supabase.anon.auth.signIn({ email, password });
  }

  signUp(email: string, password: string) {
    return this.supabase.anon.auth.signUp({ email, password });
  }

  async signOut(accessToken: string) {
    const { error } = await this.revokeToken(accessToken);
    if (error) {
      return { error };
    }
    return this.supabase.asUser(accessToken).auth.signOut();
  }

  resetPasswordByEmail(email: string) {
    return this.supabase.anon.auth.api.resetPasswordForEmail(email);
  }

  async resetPassword(token: string, newPassword: string) {
    await this.revokeToken(token);
    return this.supabase.anon.auth.api.updateUser(token, {
      password: newPassword,
    });
  }

  async revokeToken(token: string) {
    const { exp } = this.jwt.decode(token) as { exp: number };
    return this.supabase.anon
      .from<definitions['revoked_tokens']>('revoked_tokens')
      .insert({
        token: await argon2.hash(token, { type: argon2.argon2id }),
        expiration: new Date(exp * 1000).toISOString(),
      });
  }

  async isTokenRevoked(token: string) {
    const matchingRecords = await this.supabase.service
      .from<definitions['revoked_tokens']>('revoked_tokens')
      .select('*')
      .match({ token: await argon2.hash(token, { type: argon2.argon2id }) });
    return matchingRecords.data.length > 0;
  }
}
