// src/core/auth/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/core/role/enum/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
  
    const { user } = context.switchToHttp().getRequest();
    // const userRole = user?.activeRole?.name;
    const userRole = user?.activeRole?.name;
  
    // ADMIN boleh akses semua
    if (userRole === RoleEnum.ADMIN) return true;

    console.log(`User role: ${userRole}, Required roles: ${requiredRoles}`);
  
    return requiredRoles.includes(userRole);
  }
  
}
