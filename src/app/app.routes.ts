import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from "./core/guards/auth.guard";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConferencesComponent } from './pages/conferences/conferences.component';
import { InscriptionConferenceFormComponent } from './components/inscription-conference-form/inscription-conference-form.component';
import { CurrentMode } from './core/services/inscription-conference.service';

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
            component : ConferencesComponent,
            data: { mode: CurrentMode.ajoutInscription }    

           }, 
           {
            path :'mesinscriptions',
            component : ConferencesComponent,
            data: { mode: CurrentMode.editInscription }
           }, 
           {
            path :'conferences/inscription',
            component : InscriptionConferenceFormComponent
           },
        ]
    },
    {
        path: 'login', component: LoginComponent
    }
];
