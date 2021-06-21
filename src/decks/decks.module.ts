import { Module, ModuleMetadata } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';

export const metadata: ModuleMetadata = {
  imports: [SupabaseModule],
  controllers: [DecksController],
  providers: [DecksService],
};
@Module(metadata)
export class DecksModule {}
