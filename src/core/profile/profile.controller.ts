import { Controller, Get, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request & { user: { userId: string; email: string; activeRole: string } }) {
    try {
      const userId = req.user?.userId;
      console.log('ProfileController: userId from req.user', userId);
      if (!userId) {
        console.log('ProfileController: No userId in req.user');
        throw new HttpException('Invalid token payload', HttpStatus.UNAUTHORIZED);
      }
      const profile = await this.profileService.getProfile(userId);
      console.log('ProfileController: Profile result', profile);
      return profile;
    } catch (error) {
      console.log('ProfileController: Error in getProfile', error.message);
      throw new HttpException(
        error.message || 'Failed to fetch profile',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}