// src/auth/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

// src/auth/strategy/jwt.strategy.ts
export interface JwtPayload {
  userId: string;     // ✅ konsisten dipakai di semua tempat
  email: string;
  activeRole?: string;
  iat?: number;
  exp?: number;
}

const cookieExtractor = (req: any): string | null => {
  if (!req || !req.cookies) return null;
  return req.cookies['access_token'] || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return {
      userId: payload.sub,       // mapping dari "sub" di token ke "userId"
      email: payload.email,
      activeRole: payload.activeRole,
    };
  }
  
}
