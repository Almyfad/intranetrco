import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from "./core/guards/auth.guard";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConferencesComponent } from './pages/conferences/conferences.component';
import { InscriptionConferenceFormComponent } from './components/inscription-conference-form/inscription-conference-form.component';
import { CurrentMode } from './core/services/inscription-conference.service';
import { MenuComponent } from './components/menu/menu.component';
import { FichesElevesComponent } from './pages/registre/fiches.eleves/fiches.eleves.component';



export const routes: Routes = [
    {
        path: '',
        component: MenuComponent, 
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
           {
            path :'registre/fiches/eleves',
            component : FichesElevesComponent
           }
        ]
    },
    {
        path: 'login', component: LoginComponent
    }
];


