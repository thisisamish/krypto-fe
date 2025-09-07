import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Lara from '@primeng/themes/lara';
import { providePrimeNG } from 'primeng/config';
import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';

import { routes } from './app.routes';

const withCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // ensure all requests include cookies (session)
  const withCreds = req.clone({ withCredentials: true });
  return next(withCreds);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([withCredentialsInterceptor])
    ),
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
  ],
};
