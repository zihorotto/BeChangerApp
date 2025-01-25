import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpTokenInterceptor } from './services/token/interceptor/http-token.interceptor';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export function kcFactory(kcService: KeycloakService) {
  return () => kcService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpTokenInterceptor])),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      deps:[KeycloakService],
      useFactory: kcFactory,
      multi: true,
    },
    providePrimeNG({ 
      theme: {
          preset: Aura,
          options: {
              cssLayer: {
                  name: 'primeng',
                  order: 'tailwind-base, primeng, tailwind-utilities'
              }
          }
      }
  })

  ]
};
