import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
    @Get("me")
@UseGuards(JwtAuthGuard)
getMe(@CurrentUser() user: any) {
    return user;
}

@Post('refresh')
refresh(@Body() dto: RefreshTokenDto) {
  return this.authService.refresh(dto);
}
@Post('logout')
@UseGuards(JwtAuthGuard)
logout(
  @CurrentUser() user: any,
  @Body() dto: LogoutDto,
) {
  return this.authService.logout(user._id.toString(), dto.sessionId);
}
@Post('logout-all')
@UseGuards(JwtAuthGuard)
logoutAll(
  @CurrentUser() user: any,
) {
  return this.authService.logoutAll(user._id.toString());
}

}