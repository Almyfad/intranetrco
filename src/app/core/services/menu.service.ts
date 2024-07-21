import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import menuConf from './menu.yml';
import { parse } from 'yaml'
import { Menu } from './menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private Allmenus: Menu[] = parse(menuConf).root.map((menu: any) => new Menu(menu));
  private SelectedMenu$Subject = new BehaviorSubject<Menu>(this.Allmenus[0]);

  set SelectedMenu(menu: Menu) {
    this.SelectedMenu$Subject.next(menu);
  }

  get SelectedMenu(): Observable<Menu> {
    return this.SelectedMenu$Subject.asObservable();
  }

  private readonly auth = inject(AuthService);

  get menus(): Observable<Menu[]> {
    return Menu.getAllowedMenus(this.Allmenus, this.auth.UserRoles$);

  }
  constructor() { }
}
