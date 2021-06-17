import { Injectable } from '@nestjs/common';
import { SupabaseClient } from 'src/supabase/classes/supabase-client';
import { definitions } from 'src/supabase/interfaces/supabase';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  constructor(private supabase: SupabaseClient) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  deleteExpiredRevokedTokens() {
    return this.supabase.service
      .from<definitions['revoked_tokens']>('revoked_tokens')
      .delete()
      .lt('expiration', new Date().toISOString());
  }
}
