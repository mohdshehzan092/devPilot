import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as Express from 'express'; // <-- Namespace import kiya taki error khatam ho jaye

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Helper method: Yahan Express.Response use kiya hai
  private setAuthCookies(res: Express.Response, tokens: any, sessionId: string) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Express.Response // <-- Express.Response lagaya
  ) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(res, result.data.tokens, result.data.sessionId);
    return result;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Express.Response // <-- Express.Response lagaya
  ) {
    const result = await this.authService.login(dto);
    this.setAuthCookies(res, result.data.tokens, result.data.sessionId);
    return result;
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Express.Request, // <-- Express.Request lagaya
    @Res({ passthrough: true }) res: Express.Response // <-- Express.Response lagaya
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const sessionId = req.cookies['session_id'];

    const tokenToUse = refreshToken || req.body.refreshToken;
    const sessionToUse = sessionId || req.body.sessionId;

    const result = await this.authService.refresh({ 
      refreshToken: tokenToUse, 
      sessionId: sessionToUse 
    });

    this.setAuthCookies(res, result.data.tokens, sessionToUse);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: any,
    @Req() req: Express.Request, // <-- Express.Request lagaya
    @Res({ passthrough: true }) res: Express.Response // <-- Express.Response lagaya
  ) {
    const sessionId = req.cookies['session_id'] || req.body.sessionId;
    const result = await this.authService.logout(user._id.toString(), sessionId);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('session_id');

    return result;
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: Express.Response // <-- Express.Response lagaya
  ) {
    const result = await this.authService.logoutAll(user._id.toString());

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('session_id');

    return result;
  }
}
