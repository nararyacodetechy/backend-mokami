import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export interface JwtPayload {
  userId: string;
  email: string;
  activeRole?: string;
  iat?: number;
  exp?: number;
}

const cookieExtractor = (req: any): string | null => {
  console.log('JwtStrategy: Request cookies', req.cookies);
  console.log('JwtStrategy: Request query', req.query);
  console.log('JwtStrategy: Request body', req.body);

  // Try Authorization header first
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  console.log('JwtStrategy: Token from Authorization header', token ? 'found' : 'not found');
  if (token) {
    return token;
  }

  // Fallback to cookies
  if (!req || !req.cookies) {
    console.log('JwtStrategy: No cookies in request');
    return null;
  }

  const userId = (req.query && req.query.userId) || (req.body && req.body.userId);
  console.log('JwtStrategy: userId', userId);
  if (userId) {
    const token = req.cookies[`access_token_${userId}`];
    console.log('JwtStrategy: Token from userId cookie', userId, token ? 'found' : 'not found');
    return token || null;
  }

  const cookieKeys = Object.keys(req.cookies).filter((key) => key.startsWith('access_token_'));
  console.log('JwtStrategy: Cookie keys', cookieKeys);
  if (cookieKeys.length > 0) {
    const token = req.cookies[cookieKeys[0]];
    console.log('JwtStrategy: Token from first cookie', cookieKeys[0], token ? 'found' : 'not found');
    return token || null;
  }

  const genericToken = req.cookies['access_token'];
  console.log('JwtStrategy: Generic access_token', genericToken ? 'found' : 'not found');
  return genericToken || null;
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
    console.log('JwtStrategy: Validated payload', payload);
    return {
      userId: payload.sub,
      email: payload.email,
      activeRole: payload.activeRole,
    };
  }
}