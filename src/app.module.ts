import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
  ],
  controllers: [AuthController],
  providers: [
    AppService,
    AuthService,
    JwtService
  ],
})
export class AppModule {}
