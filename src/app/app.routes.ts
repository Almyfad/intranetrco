import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from "./core/guards/auth.guard";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConferencesComponent } from './pages/conferences/conferences.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard],
        children: [
           {
            path :'',
            component : DashboardComponent
           } ,
           {
            path :'conferences',
            component : ConferencesComponent
           } 
        ]
    },
    {
        path: 'login', component: LoginComponent
    }
];
