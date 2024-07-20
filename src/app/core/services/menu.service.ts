import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Menu } from '../../components/menu/menu';
import { Observable } from 'rxjs';
import menuConf from './menu.yml';
import { parse } from 'yaml'

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private Allmenus: Menu[] = parse(menuConf).root.map((menu: any) => new Menu(menu));
  private readonly auth = inject(AuthService);
  get menus(): Observable<Menu[]> {
    console.log(this.Allmenus)
    console.log(this.Allmenus)
    return Menu.getAllowedMenus(this.Allmenus, this.auth.UserRoles$); 
  }

  constructor() { }
}
