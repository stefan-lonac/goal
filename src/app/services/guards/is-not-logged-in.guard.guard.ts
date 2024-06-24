import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const isNotLoggedInGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn.pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
  );
};
