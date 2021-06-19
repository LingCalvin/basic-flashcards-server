import { Module, ModuleMetadata } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { SupabaseModule } from '../supabase/supabase.module';

export const metadata: ModuleMetadata = {
  imports: [SupabaseModule],
  providers: [ProfilesService],
  controllers: [ProfilesController],
};

@Module(metadata)
export class ProfilesModule {}
