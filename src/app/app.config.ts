import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import {provideStore} from '@ngrx/store';
import {keyValueReducer} from "./data-access/store/key-value/key-value.reducer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideIonicAngular({}),
    provideStore({
      keyValue: keyValueReducer
    }),
  ]
};