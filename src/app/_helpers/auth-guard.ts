import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '@app/_services';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  
  const usuario = loginService.usuarioValue;
  if (usuario) {
    return true;
  }

  // use the central logout method so it also closes dialogs and clears state
  // pass the attempted URL so the login page can redirect back after auth
  loginService.logout(state.url != '/' ? state.url : undefined);
  return false;
};
