import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { WordpressIntegrationService } from './services/wordpress-integration.service';
import { DataStoreService } from './services/data-store.service';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './services/interceptors/loader.interceptor';
import { TelegramService } from './services/telegram.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([LoaderInterceptor])),
    WordpressIntegrationService, DataStoreService, LoaderService, TelegramService]
};
