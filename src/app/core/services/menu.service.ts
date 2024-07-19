import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Menu } from '../../components/menu/menu';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private Allmenus: Menu[] = [
    new Menu('Accueil', 'home', '/', []),
    new Menu('Conferences', 'temple_buddhist', '/conferences', [
      new Menu('Inscription', 'add', '/conferences/inscription', []),
      new Menu('Mes Inscriptions', 'edit', '/mesinscriptions', [])
    ]),
    new Menu('Registre', 'book', '/registre', [
      new Menu('Fiches Elèves', 'people', '/registre/fiches-eleves', [],),
      new Menu('Fiches Parvis', 'wb_iridescent', '/registre/fiches-parvis', []),
      new Menu('Fiches Contacts', 'contact_page', '/registre/fiches-contacts', [], ['SYSADMIN']),
      new Menu('Fiches Jeunesses', 'child_care', '/registre/fiches-jeunesses', [], ['SYSADMIN']),
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
    ], ['SYSADMIN', 'REGISTRE']),
    new Menu('Conferences', 'temple_buddhist', '/admin-conferences', [], ['SYSADMIN', 'CONFERENCES']),
    new Menu("Comptabilité", 'account_balance', '/compta', [
      new Menu('Compta en ligne', 'account_balance_wallet', '/compta/comptes', []),
      new Menu('Paramètre generaux', 'settings', '/compta/parametres', []),
      new Menu('Sasie écritures répetitives', 'monetization_on', '/compta/ecritures', []),
      new Menu('Comptes/caisse', 'description', '/compta/comptescaisse', []),
    ], ['SYSADMIN', 'COMPTA']),
    new Menu("Administration", 'admin_panel_settings', '/admin', [])
  ]

  private readonly auth = inject(AuthService);
  get menus(): Observable<Menu[]> {
    return Menu.getAllowedMenus(this.Allmenus, this.auth.UserRoles$);
  }

  constructor() { }
}
