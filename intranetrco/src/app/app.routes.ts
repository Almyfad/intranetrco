import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    {
        path: 'login', component: LoginComponent
    }
];
