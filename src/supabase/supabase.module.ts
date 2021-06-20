import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { MisconfiguredException } from '../common/exceptions/misconfigured.exception';
import { SupabaseClient } from './classes/supabase-client';

const supabase = {
  provide: SupabaseClient,
  useFactory: (config: ConfigService): SupabaseClient => {
    // Ensure necessary environment variables were set
    const supabaseUrl = config.get('SUPABASE_URL');
    if (!supabaseUrl) {
      throw new MisconfiguredException(
        'Missing environment variable: SUPABASE_URL',
      );
    }
    const supabasePublicKey = config.get('SUPABASE_PUBLIC_KEY');
    if (!supabasePublicKey) {
      throw new MisconfiguredException(
        'Missing environment variable: SUPABASE_PUBLIC_KEY',
      );
    }
    const supabaseSecretKey = config.get('SUPABASE_SECRET_KEY');
    if (!supabaseSecretKey) {
      throw new MisconfiguredException(
        'Missing environment variable: SUPABASE_SECRET_KEY',
      );
    }

    return {
      anon: createClient(supabaseUrl, supabasePublicKey),
      service: createClient(supabaseUrl, supabaseSecretKey),
      asUser: (token: string) => {
        const client = createClient(supabaseUrl, supabasePublicKey);
        client.auth.setAuth(token);
        return client;
      },
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  exports: [supabase],
  providers: [supabase],
})
export class SupabaseModule {}
