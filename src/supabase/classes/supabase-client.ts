import { SupabaseClient as Client } from '@supabase/supabase-js';

export class SupabaseClient {
  anon: Client;
  service: Client;
}
