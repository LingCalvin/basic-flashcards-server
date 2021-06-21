import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProfilesModule } from './profiles/profiles.module';
import { DecksModule } from './decks/decks.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    SupabaseModule,
    ScheduleModule.forRoot(),
    ProfilesModule,
    DecksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
