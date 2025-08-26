import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/core/users/entity/users.entity';
import { Roles } from 'src/core/role/entity/roles.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('JwtAuthGuard: Request cookies', request.cookies);
    console.log('JwtAuthGuard: Request query', request.query);
    console.log('JwtAuthGuard: Request body', request.body);
    console.log('JwtAuthGuard: req.user before super.canActivate', request.user);

    // Call parent AuthGuard('jwt') to trigger JwtStrategy
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      console.log('JwtAuthGuard: super.canActivate failed');
      throw new UnauthorizedException('Token validation failed');
    }

    console.log('JwtAuthGuard: req.user after super.canActivate', request.user);
    if (!request.user) {
      console.log('JwtAuthGuard: No user in request');
      throw new UnauthorizedException('No user found in token');
    }

    // Verify user and active role
    const user = await this.usersRepository.findOne({
      where: { id: request.user.userId },
      relations: ['activeRole', 'roles'],
    });

    if (!user) {
      console.log('JwtAuthGuard: User not found for ID', request.user.userId);
      throw new UnauthorizedException('User not found');
    }

    if (!user.activeRole) {
      console.log('JwtAuthGuard: No active role for user', user.id);
      throw new UnauthorizedException('No active role assigned');
    }

    if (request.user.activeRole !== user.activeRole.role_name) {
      console.log('JwtAuthGuard: Token activeRole mismatch', {
        tokenRole: request.user.activeRole,
        dbRole: user.activeRole.role_name,
      });
      throw new UnauthorizedException('Invalid role in token');
    }

    console.log('JwtAuthGuard: User authenticated', {
      userId: user.id,
      email: user.email,
      activeRole: user.activeRole.role_name,
    });

    return true;
  }
}