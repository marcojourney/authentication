import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [],
    providers: [AuthService, LocalStrategy]
  })
  export class AuthModule {}