import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseClient } from '../supabase/classes/supabase-client';
import { definitions } from '../supabase/interfaces/supabase';

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
