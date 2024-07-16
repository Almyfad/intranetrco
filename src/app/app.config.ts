import { ApplicationConfig, Provider } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Configuration } from '../osmose-api-client/configuration';
import { TokenService } from './core/services/token.service';


export function apiConfigFactory(authService: TokenService): Configuration {
  return new Configuration({
    basePath: 'http://localhost:8080',
    credentials: { Bearer: () => authService.token }, // Utilisez le service pour obtenir le token
  });
}

const configurationProvider: Provider = {
  provide: Configuration,
  useFactory: apiConfigFactory,
  deps: [TokenService]
};


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()),
    configurationProvider,
  provideHttpClient(
    withInterceptors([authInterceptor])
  ),
  provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),]
};
