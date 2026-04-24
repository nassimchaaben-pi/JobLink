import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthStateService);
  const router = inject(Router);
  const requiredRoles = (route.data['roles'] as string[] | undefined) ?? [];
  const role = auth.getRole();

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (role && requiredRoles.includes(role)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
