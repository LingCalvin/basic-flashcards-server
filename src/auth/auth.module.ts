import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AnonymousAuthGuard } from './guards/anonymous-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CleanupService } from './cleanup.service';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    SupabaseModule,
  ],
  providers: [
    AnonymousAuthGuard,
    AuthService,
    CleanupService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
