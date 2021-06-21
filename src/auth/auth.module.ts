import { Module, ModuleMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CleanupService } from './cleanup.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { AnonymousStrategy } from './strategies/anonymous.strategy';

export const metadata: ModuleMetadata = {
  imports: [
    ConfigModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    SupabaseModule,
  ],
  exports: [AuthService],
  providers: [
    AnonymousStrategy,
    AuthService,
    CleanupService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
};
@Module(metadata)
export class AuthModule {}
