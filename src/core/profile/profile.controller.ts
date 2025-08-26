// src/core/profile/profile.controller.ts
import { Controller, Get, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request & { user: { userId: string } }) {
    try {
      const userId = req.user?.userId || req.query.userId;
      if (!userId) {
        console.log('ProfileController: No userId provided');
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }
      const profile = await this.profileService.getProfile(userId as string);
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