import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/types/users';

// RBAC
export const ROLES_KEY = 'user_roles';

export const Roles = (role: UserRole) => SetMetadata(ROLES_KEY, role);
