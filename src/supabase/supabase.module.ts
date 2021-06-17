import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from './classes/supabase-client';

const supabase = {
  provide: SupabaseClient,
  useFactory: (config: ConfigService): SupabaseClient => ({
    anon: createClient(
      config.get('SUPABASE_URL'),
      config.get('SUPABASE_PUBLIC_KEY'),
    ),
    service: createClient(
      config.get('SUPABASE_URL'),
      config.get('SUPABASE_SECRET_KEY'),
    ),
    asUser: (token: string) => {
      const client = createClient(
        config.get('SUPABASE_URL'),
        config.get('SUPABASE_PUBLIC_KEY'),
      );
      client.auth.setAuth(token);
      return client;
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  exports: [supabase],
  providers: [supabase],
})
export class SupabaseModule {}
