import { 
  Controller
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AuthController {
  @MessagePattern({ role: 'auth', cmd: 'get_users' })
  getUsers() {
    return 'get all users - hello world';
  }
}