import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { TokenService } from './services/token.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    PassportModule.register({
      defaultStrategy: 'jwt',
}),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    TokenService,
    JwtStrategy
  ],
  
})
export class AuthModule {}
