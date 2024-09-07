import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import {provideStore} from '@ngrx/store';
import {keyValueReducer} from "./data-access/store/key-value/key-value.reducer";
import {provideStoreDevtools} from "@ngrx/store-devtools";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular({}),
    provideStoreDevtools({ maxAge: 25 }),
    provideStore({
      keyValue: keyValueReducer
    }),
  ]
};
