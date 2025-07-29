import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/strategy/jwt.strategy';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // @Get('me')
  // @UseGuards(JwtAuthGuard)
  // async getMe(@Req() req: Request & { user: JwtPayload }) {
  //   return this.profileService.getProfile(req.user.userId);
  // }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: { userId: string; email: string; activeRole: string } }) {
    return this.profileService.getProfile(req.user.userId);
  }
}