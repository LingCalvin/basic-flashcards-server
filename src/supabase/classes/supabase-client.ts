import { SupabaseClient as Client } from '@supabase/supabase-js';

/**
 * A client for interacting with Supabase as various roles or users.
 */
export class SupabaseClient {
  anon: Client;
  service: Client;
  asUser: (token: string) => Client;
}
