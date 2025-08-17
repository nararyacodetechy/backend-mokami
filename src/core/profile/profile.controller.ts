import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  // Jangan gunakan @Roles(RoleEnum.ADMIN) di sini, kecuali memang mau membatasi
  @Get('me')
  async getProfile(@Req() req: Request & { user: { userId: string } }) {
    return this.profileService.getProfile(req.user.userId);
  }

}