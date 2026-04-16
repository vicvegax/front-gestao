import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '@app/_services';
import { environment } from '@env/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);

  const usuario = loginService.usuarioValue;
  if (usuario && usuario.access_token && req.url.includes(environment.api)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${usuario.access_token}`
      }
    });
  }

  return next(req);
};
