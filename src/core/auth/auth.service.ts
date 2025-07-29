// src/auth/auth.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/core/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { Users } from '../users/entity/users.entity';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { UserRole } from '../role/entity/user-roles.entity';
import { Role } from '../role/entity/role.entity';
import { UserSessions } from '../users/entity/users-sessions.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserSessions)
    private readonly userSessionsRepository: Repository<UserSessions>,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    try {
      const { email, password, fullName, roles } = dto;

      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) throw new BadRequestException('Email already registered');

      const hashedPassword = await bcrypt.hash(password, 10);
      const token = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      const user = this.userRepository.create({
        id: uuidv4(),
        email,
        hashedPassword,
        fullName,
        isEmailVerified: false,
        emailVerificationToken: token,
        emailVerificationExpires: expires,
      });

      const savedUser = await this.userRepository.save(user);

      const defaultRoles = await this.roleRepository.find({
        where: { name: In(roles?.length ? roles : ['user']) },
      });

      if (!defaultRoles.length) {
        throw new InternalServerErrorException('No valid roles found');
      }

      for (const role of defaultRoles) {
        const userRole = this.userRoleRepository.create({
          id: uuidv4(),
          userId: savedUser.id,
          roleId: role.id,
        });
        await this.userRoleRepository.save(userRole);
      }

      // Set activeRole to the first role (e.g., 'user')
      await this.userRepository.update(savedUser.id, { activeRole: defaultRoles[0] });

      await this.sendVerificationEmail(savedUser.email, token);
      console.log('[REGISTER] New user created:', savedUser.id);

      return {
        status: 'success',
        message: 'Registration successful. Please verify your email.',
        user: {
          id: savedUser.id,
          email: savedUser.email,
          fullName: savedUser.fullName,
          roles: defaultRoles.map((r) => r.name),
          isEmailVerified: savedUser.isEmailVerified,
        },
      };
    } catch (error) {
      console.error('[REGISTER_ERROR]', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    await this.mailService.sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Token invalid or expired');

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      activeRole: user.activeRole?.name,
    };

    const refreshToken = randomBytes(64).toString('hex');
    await this.userSessionsRepository.save({
      id: uuidv4(),
      userId: user.id,
      refreshToken,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          roles: user.roles ? user.roles.map((r) => r.name) : [], // Handle undefined roles
          activeRole: user.activeRole?.name,
        },
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const session = await this.userSessionsRepository.findOne({ where: { refreshToken } });
    if (!session) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userRepository.findOne({
      where: { id: session.userId },
      relations: ['activeRole', 'roles'],
    });
    if (!user) throw new UnauthorizedException('User not found');

    // Optionally rotate refresh token
    const newRefreshToken = randomBytes(64).toString('hex');
    await this.userSessionsRepository.update(session.id, { refreshToken: newRefreshToken });

    const payload = {
      sub: user.id,
      email: user.email,
      activeRole: user.activeRole?.name,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: newRefreshToken,
    };
  }

  async handleGoogleLogin(googleUser: any) {
    const { email, displayName } = googleUser;

    let user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'activeRole'], // Load roles and activeRole
    });

    if (!user) {
      user = this.userRepository.create({
        id: uuidv4(),
        email,
        fullName: displayName || 'Google User',
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      });

      user = await this.userRepository.save(user);
      console.log('[GOOGLE_AUTH] New user created from Google:', user);

      // Assign default role
      const defaultRole = await this.roleRepository.findOne({ where: { name: 'user' } });
      if (!defaultRole) {
        throw new InternalServerErrorException('Default role not found');
      }

      const userRole = this.userRoleRepository.create({
        id: uuidv4(),
        userId: user.id,
        roleId: defaultRole.id,
      });
      await this.userRoleRepository.save(userRole);

      // Set active role
      await this.userRepository.update(user.id, {
        activeRole: defaultRole,
      });

      // Re-fetch user with roles
      user = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['roles', 'activeRole'],
      });
    }

    return this.login(user);
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.userRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await this.mailService.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click to reset password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return { message: 'Password reset link sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, {
      hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return { message: 'Password reset successfully' };
  }

  async setPasswordForGoogleUser(userId: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    if (user.hashedPassword) {
      throw new BadRequestException('Password already set for this account');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { hashedPassword });

    return { message: 'Password set successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    if (user.isEmailVerified) throw new BadRequestException('Email already verified');

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.userRepository.update(user.id, {
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    });

    await this.sendVerificationEmail(email, token);
    return { message: 'Verification email resent' };
  }

  async logout(userId: string, refreshToken: string) {
    await this.userSessionsRepository.delete({ userId, refreshToken });
    return { message: 'Logged out successfully' };
  }
}