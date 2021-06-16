import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from 'src/supabase/classes/supabase-client';

@Injectable()
export class AuthService {
  constructor(@Inject(SupabaseClient) private supabase: SupabaseClient) {}

  validateUser(email: string, password: string) {
    return this.supabase.anon.auth.signIn({ email, password });
  }

  signUp(email: string, password: string) {
    return this.supabase.anon.auth.signUp({ email, password });
  }

  resetPasswordByEmail(email: string) {
    return this.supabase.anon.auth.api.resetPasswordForEmail(email);
  }

  resetPassword(token: string, newPassword: string) {
    return this.supabase.anon.auth.api.updateUser(token, {
      password: newPassword,
    });
  }
}
