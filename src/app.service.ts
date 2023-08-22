import { 
  Injectable, 
  NotFoundException, 
  UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { Session } from './session.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  
  async signIn(userName: string, password: string, ip: string, userAgent: string) {
    const user: User = await this.userRepository.findOne({where: { userName }});

    if (!user) {
      throw new NotFoundException('Account does not exist. Please create an account or try again with a different username.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials. Please check your username and password and try again.');
    }
  
    const tokens = await this.getTokens(user.id, user.userName);
    
    await this.sessionRepository.insert({userId: user.id, accessToken: tokens.accessToken, userAgent, ip});
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  getHashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.getHashData(refreshToken);
    await this.userRepository.update({id: userId}, {refreshToken: hashedRefreshToken});
  }

  async getTokens(id: number, userName: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username: userName,
          role: 'admin',
          scope: 'read'
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          username: userName,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken
    };
  }
}

