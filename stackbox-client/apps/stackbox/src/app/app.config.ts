import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideStackboxApi } from '@stackbox/shared/api-stackbox';
import { ROUTER_METADATA } from '@stackbox/shared/utils-router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: ROUTER_METADATA, useValue: appRoutes },
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.api.url}/*`,
            tokenOptions: {
              authorizationParams: {
                audience: environment.api.audience,
                scope: environment.api.scope,
              },
            },
          },
        ],
      },
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authHttpInterceptorFn])
    ),
    provideStackboxApi({ basePath: environment.api.url }),
  ],
};
