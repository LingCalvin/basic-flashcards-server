import { Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '../supabase/classes/supabase-client';
import { definitions } from '../supabase/interfaces/supabase';
import { ProfilesService } from '../profiles/profiles.service';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

@Injectable()
export class AuthService {
  constructor(
    private profiles: ProfilesService,
    @Inject(SupabaseClient) private supabase: SupabaseClient,
    private jwt: JwtService,
  ) {}

  validateUser(email: string, password: string) {
    return this.supabase.anon.auth.signIn({ email, password });
  }

  async signUp(email: string, password: string) {
    const signUpRes = await this.supabase.anon.auth.signUp({ email, password });
    if (signUpRes.error === null) {
      const randomUsername = uniqueNamesGenerator({
        style: 'capital',
        dictionaries: [adjectives, colors, animals],
        separator: ' ',
      });
      await this.profiles.update(
        signUpRes.user?.id ?? '',
        { username: randomUsername },
        process.env.SUPABASE_SECRET_KEY ?? '',
      );
    }
    return signUpRes;
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
      .match({ token: await argon2.hash(token, { type: argon2.argon2id }) })
      .throwOnError();
    return (matchingRecords.data?.length ?? 1) > 0;
  }

  // async verifyEmail(token: string) {
  //   this.supabase.anon.auth.
  // }
}
