import { 
  Controller
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AuthController {
  constructor(private authService: AppService) {}

  @MessagePattern({ cmd: 'auth_login' })
  signIn({ username, password, userAgent, ip }) {
    return this.authService.signIn(username, password, ip, userAgent);
  }
}