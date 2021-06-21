import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';

@Module({
  imports: [SupabaseModule],
  controllers: [DecksController],
  providers: [DecksService],
})
export class DecksModule {}
