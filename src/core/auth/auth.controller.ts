// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Query, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import * as passport from 'passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './strategy/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request & { user: any }) {
    console.log('AuthController.me: Request user', req.user);
    const userId = req.user?.userId || req.user?.sub;
    if (!userId) {
      console.log('AuthController.me: No userId in request');
      throw new UnauthorizedException('Invalid token payload');
    }
    const result = await this.authService.getProfileById(userId);
    console.log('AuthController.me: Profile result', result);
    return result;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    const result = await this.authService.login(user);

    const { accessToken, refreshToken, user: userData } = result.data;

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(`access_token_${userData.id}`, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return res.json({
      status: result.status,
      message: result.message,
      data: {
        accessToken,
        refreshToken,
        user: userData,
      },
    });
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, userId } = req.body;

    const result = await this.authService.refreshToken(refreshToken, userId);

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(`access_token_${userId}`, result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return res.json({
      message: 'Token refreshed',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    return passport.authenticate('google', {
      scope: ['email', 'profile'],
      prompt: 'select_account',
    })(req, res);
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async handleRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    console.log('AuthController.googleRedirect: User from Google', user);
    const { accessToken, refreshToken, user: userData } = (await this.authService.handleGoogleLogin(user)).data;

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(`access_token_${userData.id}`, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    console.log('AuthController.googleRedirect: Token set for user', userData.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/login/success`);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  async setPassword(@Req() req: Request & { user: JwtPayload }, @Body() body: { newPassword: string }) {
    return this.authService.setPasswordForGoogleUser(req.user.userId, body.newPassword);
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request & { user: JwtPayload }, @Res() res: Response, @Body() body: { refreshToken: string }) {
    await this.authService.logout(req.user.userId, body.refreshToken);
    res.clearCookie(`access_token_${req.user.userId}`);
    return res.json({ message: 'Logged out successfully' });
  }
}