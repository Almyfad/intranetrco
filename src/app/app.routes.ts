import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AuthComponent } from './components/auth/auth.component';



export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
        children: [
          {
            path: 'address',
            loadComponent: () =>
              import('./address-form/address-form.component').then(
                (c) => c.AddressFormComponent
              ),
            title: 'Address',
            children: [
              {
                path: 'address',
                loadComponent: () =>
                  import('./address-form/address-form.component').then(
                    (c) => c.AddressFormComponent
                  ),
                title: 'Address'
              },
            ]
          },
        ]
      },
      {
        path: 'conferences',
        title: 'Conferences',
        loadComponent: () =>
          import('./address-form/address-form.component').then(
            (c) => c.AddressFormComponent
          ),
      },
      {
        path: 'mailing',
        title: 'Email',
        loadComponent: () => import('./pages/email/email.component').then(c => c.EmailComponent)
      },
      {
        path: 'creer/conference',
        loadComponent: () =>
          import('./components/creer-conference-form/creer-conference-form.component').then(
            (c) => c.CreerConferenceFormComponent
          ),
        title: 'Conferences'
      },
      {
        path: 'registre/fiches/eleves',
        loadComponent: () =>
          import('./pages/registre/fiches.eleves/fiches.eleves.component').then(
            (c) => c.FichesElevesComponent
          ),
        title: 'Fiches Eleves'
      },
      {
        path: 'administation',
        loadComponent: () =>
          import('./pages/administration/administration.component').then(
            (c) => c.AdministrationComponent
          ),
        title: 'Administation'
      },
      {
        path: 'developpment',
        loadComponent: () =>
          import('./pages/development/development.component').then(
            (c) => c.DevelopmentComponent
          ),
        title: 'Developpment'
      },
      {
        path: 'address',
        loadComponent: () =>
          import('./address-form/address-form.component').then(
            (c) => c.AddressFormComponent
          ),
        title: 'Address'
      },

      {
        path: 'tree',
        loadComponent: () =>
          import('./tree/tree.component').then(
            (c) => c.TreeComponent
          ),
        title: 'Tree'
      },
      {
        path: 'drag-drop',
        loadComponent: () =>
          import('./drag-drop/drag-drop.component').then(
            (c) => c.DragDropComponent
          ),
        title: 'Drag-Drop'
      },
    ]
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },

  {
    path: 'logout',
    pathMatch: 'full',
    component: LogoutComponent,
  }
];


