import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, ToasterService } from '@app/_services';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const toast = inject(ToasterService);
  const routes = inject(Router);  

  return next(req).pipe(
    catchError(err => {
      // if (err.status == HttpStatusCode.Forbidden && loginService.usuarioValue) {
      //   toast.showError('Vocẽ não tem permissão para acessar este recurso.');
      //   routes.navigate(['/']);
      // }

      if (err.status == HttpStatusCode.Unauthorized && loginService.usuarioValue) {
        toast.showWarning('Sua sessão expirou. Por favor, faça login novamente.');
        loginService.logout();
      }

      return throwError(() => err);
    }));
};
