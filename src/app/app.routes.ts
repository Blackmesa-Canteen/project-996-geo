import { Routes } from '@angular/router';
import {FeatureDetailComponent} from "./component/feature-detail/feature-detail.component";

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
    path: 'category-filter',
    loadComponent: () => import('./page/category-filter/category-filter.component').then((m) => m.CategoryFilterComponent)
  },
  {
    path: 'slides',
    loadComponent: () => import('./component/slides-demo/app-range-example').then((m) => m.AppRangeExample)
  },
  {
    path: 'feature-details',
    loadComponent: () => import('./component/feature-detail/feature-detail.component').then((m) => m.FeatureDetailComponent)
  }
];
