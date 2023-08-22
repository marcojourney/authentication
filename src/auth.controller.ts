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

  @MessagePattern({ cmd: 'change_password' })
  changePassword({ oldPassword, newPassword }) {
    return `change password ${oldPassword}, ${newPassword}`;
  }

  @MessagePattern({ cmd: 'reset_password' })
  resetPassword({ newPassword, confirmPassword }) {
    return `reset password ${newPassword}, ${confirmPassword}`
  }

  @MessagePattern({ cmd: 'logout' })
  logout() {
    return 'logout';
  }
}