import { Module, ModuleMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AnonymousAuthGuard } from './guards/anonymous-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CleanupService } from './cleanup.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';

export const metadata: ModuleMetadata = {
  imports: [
    ConfigModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    SupabaseModule,
  ],
  exports: [AuthService],
  providers: [
    AnonymousAuthGuard,
    AuthService,
    CleanupService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
};
@Module(metadata)
export class AuthModule {}
