import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { NotificationService } from './notification-service';
import { catchError, map, of } from 'rxjs';

// No necesitamos la clase UserGuard como tal para una CanActivateFn
// sino que la lógica se integra directamente en la función.

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const noti = inject(NotificationService);

  if (!authService.isAuthenticatedSignal()) {
    noti.warning('Autorización', 'Acceso Denegado', 3000);
    return router.createUrlTree(['/usuario/login']);
  }

  const currentUser = authService.currentUserSignal();

  if (!currentUser) {
    return authService.getUserProfile().pipe(
      map((user) => {
        if (!user) return router.createUrlTree(['/usuario/login']);

        const rolesAllowed = route.data['roles'] || [];
        if (rolesAllowed.length > 0 && !rolesAllowed.includes(user.role)) {
          noti.warning('Acceso Restringido', 'Usuario sin permisos', 3000);
          return router.createUrlTree(['/usuario/login']);
        }

        return true;
      }),
      catchError(() => of(router.createUrlTree(['/usuario/login'])))
    );
  }

  const rolesAllowed = route.data['roles'] || [];
  if (rolesAllowed.length > 0 && !rolesAllowed.includes(currentUser.role)) {
    noti.warning('Acceso Restringido', 'Usuario sin permisos', 3000);
    return router.createUrlTree(['/usuario/login']);
  }

  return true;
};
