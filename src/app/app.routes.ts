import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./page/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'slides',
    loadComponent: () => import('./page/slides-demo/slides-demo.component').then((m) => m.SlidesDemoComponent)
  }
];
