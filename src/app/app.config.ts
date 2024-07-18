import { ApplicationConfig, Provider } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Configuration } from '../osmose-api-client/configuration';


export function apiConfigFactory(): Configuration {
  return new Configuration({
    basePath: 'https://localhost:7265',
    withCredentials: true,
  });
}

const configurationProvider: Provider = {
  provide: Configuration,
  useFactory: apiConfigFactory,
};


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()),
    configurationProvider,
  provideHttpClient(
    withInterceptors([authInterceptor])
  ),
  provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),]
};
