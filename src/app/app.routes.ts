import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/starter',
        pathMatch: 'full',
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'sample-page',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path:'registre',
        loadChildren: () =>
          import('./pages/registre/registre.route').then((m) => m.RegistreRoutes),
      },
      {
        path: 'sidenav-demo',
        loadComponent: () =>
          import('./components/sidenav-demo/sidenav-demo.component').then(
            (m) => m.SidenavDemoComponent
          ),
      },
      {
        path: 'alternative-customizer',
        loadComponent: () =>
          import('./layouts/full/shared/alternative-customizer/alternative-customizer-page.component').then(
            (m) => m.AlternativeCustomizerPageComponent
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
