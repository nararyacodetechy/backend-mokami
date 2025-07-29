import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('BACKEND_URL')}/auth/google/redirect`,
      scope: ['email', 'profile'],
      passReqToCallback: true, // ini wajib untuk StrategyOptionsWithRequest
    } as StrategyOptionsWithRequest); // cast agar Typescript tidak protes
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails?.[0]?.value,
      displayName: `${name?.givenName || ''} ${name?.familyName || ''}`,
      photo: photos?.[0]?.value,
      provider: 'google',
    };
    done(null, user);
    console.log('[GOOGLE STRATEGY] Validating user:', user);
  }
}
