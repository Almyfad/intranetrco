import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from "./core/guards/auth.guard";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConferencesComponent } from './pages/conferences/conferences.component';
import { InscriptionConferenceFormComponent } from './components/inscription-conference-form/inscription-conference-form.component';
import { CurrentMode } from './core/services/inscription-conference.service';
import { Menu, MenuComponent } from './components/menu/menu.component';

const menus: Menu[] = [
    new Menu('Accueil', 'home', '/', []),
    new Menu('Conferences', 'temple_buddhist', '/conferences', [
      new Menu('Inscription', 'add', '/conferences/inscription', []),
      new Menu('Mes Inscriptions', 'edit', '/mesinscriptions', [])
    ]),
    new Menu('Registre', 'book', '/registre', [
      new Menu('Fiches Elèves', 'people', '/registre/fiches-eleves', []),
      new Menu('Fiches Parvis', 'wb_iridescent', '/registre/fiches-parvis', []),
      new Menu('Fiches Contacts', 'contact_page', '/registre/fiches-contacts', []),
      new Menu('Fiches Jeunesses', 'child_care', '/registre/fiches-jeunesses', []),
      new Menu('Fiches Jeunes Rosicruciens', 'settings_accessibility', '/registre/fiches-jeunes-rosicruciens', []),
      new Menu('Saisie Présences', 'featured_play_list', '/registre/traitements', [
        new Menu('Présence Villes', 'list_alt', '/registre/traitements/encours', []),
        new Menu('Présence CR', 'fact_check', '/registre/traitements/termines', []),
        new Menu('Présence EI', 'receipt_long', '/registre/traitements/termines', []), 
      ]),
      new Menu('Statistiques', 'insert_chart_outlined', '/registre/statistiques', [
        new Menu('Présences', 'list_alt', '/registre/statistiques/villes', []),
        new Menu('Mouvements', 'autorenew', '/registre/statistiques/mouvements', []),
      ]),
    ],['SYSADMIN', 'REGISTRE']),
    new Menu('Conferences', 'temple_buddhist', '/admin-conferences', [], ['SYSADMIN', 'CONFERENCES']),
    new Menu("Comptabilité", 'account_balance', '/compta', [
      new Menu('Compta en ligne', 'account_balance_wallet', '/compta/comptes', []),
      new Menu('Paramètre generaux', 'settings', '/compta/parametres', []),
      new Menu('Sasie écritures répetitives', 'monetization_on', '/compta/ecritures', []),
      new Menu('Comptes/caisse', 'description', '/compta/comptescaisse', []),
    ], ['SYSADMIN', 'COMPTA']),
    new Menu("Administration", 'admin_panel_settings', '/admin', [])
  ];


export const routes: Routes = [
    {
        path: '',
        component: MenuComponent, 
        data: { menus: menus },
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


