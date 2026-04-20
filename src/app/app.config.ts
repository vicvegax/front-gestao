import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@app/_helpers/error-interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { jwtInterceptor } from '@app/_helpers/jwt-interceptor';
import { provideNgxMask } from 'ngx-mask';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';

//REGISTRAR PACOTE DE DATA
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: "ignore"
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    importProvidersFrom(MatSnackBarModule),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    provideNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt-BR'},
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timeout: '-0300' }},
    provideLuxonDateAdapter()
  ]
};
