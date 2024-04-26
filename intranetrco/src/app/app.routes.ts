import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    {
        path: 'login', component: LoginComponent
    }
];
