import { ApplicationConfig, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { Configuration } from './core/osmose-api-client';
import { environment } from '../environments/environment';


export function apiConfigFactory(): Configuration {
  return new Configuration({
    basePath: environment.apiURL,
    withCredentials: true,
  });
}

const configurationProvider: Provider = {
  provide: Configuration,
  useFactory: apiConfigFactory,
};

export const appConfig: ApplicationConfig = {
  providers: 
  [
    configurationProvider,
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ]
};
