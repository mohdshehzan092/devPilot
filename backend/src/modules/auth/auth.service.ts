import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../dto/register.dto';
import { PasswordUtil } from 'src/common/utils/password.util';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './services/token.service';
import { ConflictException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
  private readonly usersService: UsersService,

  private readonly tokenService: TokenService,

  private readonly redisService: RedisService,

  
) {}

   

   

     async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if(existingUser) {
            throw new ConflictException('User with this email already exists');
        }
        const hashedPassword = await PasswordUtil.hash(dto.password);
        const user = await this.usersService.create({
            ...dto,
            password: hashedPassword
        })
        const tokens = await this.tokenService.generateTokens(
            {
                sub: user._id.toString(),
                email: user.email,
                role: user.role
            }
        );

        const sessionId = uuidv4();
        const hashedRefreshToken = await PasswordUtil.hash(tokens.refreshToken);

await this.redisService.set(
  `session:${user._id}:${sessionId}`,
  {
    userId: user._id.toString(),
    refreshToken: hashedRefreshToken,
    loginAt: new Date(),
    lastActivity: new Date(),
  },
  60 * 60 * 24 * 7, // 7 Days
);

        const userObject = user.toObject();
        const { password, ...safeUser } = userObject;

return {
  message: 'User registered successfully',
  data: {
    user: safeUser,
    tokens,
    sessionId,
  },
};
    }

    

    async login(dto: LoginDto){
        const user = await this.usersService.findByEmailAndPassword(dto.email);

        if(!user){
            throw new UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await PasswordUtil.verify(user.password, dto.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid email or password');
        }
        const tokens = await this.tokenService.generateTokens({
            sub: user._id.toString(),
            email: user.email,
            role: user.role
        });
        const userObject = user.toObject();

        const { password, ...safeUser } = userObject;

        const sessionId = uuidv4();
        const hashedRefreshToken = await PasswordUtil.hash(tokens.refreshToken);

await this.redisService.set(
  `session:${user._id}:${sessionId}`,
  {
    userId: user._id.toString(),
    refreshToken: hashedRefreshToken,
    loginAt: new Date(),
    lastActivity: new Date(),
  },
  60 * 60 * 24 * 7,
);
        

return {
  message: 'User logged in successfully',
  data: {
    user: safeUser,
    tokens,
    sessionId
  },
};
    }

async refresh(dto: RefreshTokenDto) {
  // Verify refresh token
  const payload = await this.tokenService.verifyRefreshToken(dto.refreshToken);

  // Find user
  const user = await this.usersService.findById(payload.sub);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // Get session from Redis
  const session = await this.redisService.get<{
    userId: string;
    refreshToken: string;
  }>(`session:${user._id}:${dto.sessionId}`);

  if (!session) {
    throw new UnauthorizedException('Session expired');
  }

  // Verify hashed refresh token
  const isValid = await PasswordUtil.verify(
    session.refreshToken,
    dto.refreshToken,
  );

  if (!isValid) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  // Generate new tokens
  const tokens = await this.tokenService.generateTokens({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Hash new refresh token
  const hashedRefreshToken = await PasswordUtil.hash(tokens.refreshToken);

  // Update session
  await this.redisService.set(
    `session:${user._id}:${dto.sessionId}`,
    {
      userId: user._id.toString(),
      refreshToken: hashedRefreshToken,
      loginAt: new Date(),
      lastActivity: new Date(),
    },
    60 * 60 * 24 * 7,
  );

  return {
    message: 'Token refreshed successfully',
    data: {
      tokens,
    },
  };
}
async logout(userId: string, sessionId: string) {
  await this.redisService.del(
    `session:${userId}:${sessionId}`,
  );

  return {
    message: 'Logged out successfully',
  };
}
async logoutAll(userId: string) {
  const keys = await this.redisService.keys(
    `session:${userId}:*`,
  );

  if (keys.length) {
    await Promise.all(
      keys.map((key) => this.redisService.del(key)),
    );
  }

  return {
    message: 'Logged out from all devices',
  };
}
}


