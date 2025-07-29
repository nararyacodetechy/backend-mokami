import { Controller, Post, Body, BadRequestException, Get, Query, UseGuards, Req, Res } from '@nestjs/common';
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
    
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        return this.authService.login(user);
    }

    @Post('verify-email')
    async verifyEmail(@Body() body: { token: string }) {
        return this.authService.verifyEmail(body.token);
    }

    @Post('refresh-token')
    async refreshToken(@Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(body.refreshToken);
    }

    @Get('google')
    async googleAuth(@Req() req: Request, @Res() res: Response) {
        return passport.authenticate('google', {
        scope: ['email', 'profile'],
        prompt: 'select_account', // 👈 ini memaksa Google tampilkan pilihan akun
        })(req, res);
    }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async handleRedirect(@Req() req: Request, @Res() res: Response) {
        const user = req.user as any;
        const result = await this.authService.handleGoogleLogin(user);

        const token = result.data.accessToken;
        res.redirect(`${process.env.FRONTEND_URL}/auth/login/success?token=${token}`);
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
    async logout(@Req() req: Request & { user: JwtPayload }, @Body() body: { refreshToken: string }) {
        return this.authService.logout(req.user.userId, body.refreshToken);
    }
}
