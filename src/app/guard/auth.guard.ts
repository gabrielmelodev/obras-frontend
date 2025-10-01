import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();
  if (authService.isLoggedIn() && user?.role === 'ADMIN_MASTER') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
