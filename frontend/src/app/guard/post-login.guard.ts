import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const postLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if(user != null) {
    router.navigate(['/games']);
    return false;
  } else {
    
    return true;
  }
};
