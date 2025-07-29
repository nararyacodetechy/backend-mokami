import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from '../users/entity/users.entity';
import { UserSessions } from '../users/entity/users-sessions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserRole } from '../role/entity/user-roles.entity';
import { Role } from '../role/entity/role.entity';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MailModule,
    TypeOrmModule.forFeature([Users, UserSessions, Role, UserRole]), 
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}