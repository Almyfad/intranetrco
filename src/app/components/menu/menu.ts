import { Observable, map, of } from "rxjs";
import { MenuTitle } from "./menu.tittle";


interface MenuOptions {
  label: string;
  icon: string;
  route: string;
  children?: Menu[];
  roles?: string[];
  title?: MenuTitle;
}

export class Menu {
  label: string
  icon: string
  route: string
  roles: string[];
  title: MenuTitle | undefined;
  children: Menu[] = [];
  get hasChildren(): boolean {
    return this.children.length > 0;
  }
  get children$(): Observable<Menu[]> {
    return of(this.children);
  }

  constructor(options: MenuOptions) {
    this.label = options.label;
    this.icon = options.icon;
    this.route = options.route;
    this.children = (options.children || []).map(childOptions => new Menu(childOptions));
    this.roles = options.roles || ["USER"];
    this.title = options.title;
  }

  isAllowed(userRoles: string[]): boolean {
    return this.roles.some(menuRole => userRoles.includes(menuRole));
  }

  static getAllowedMenus(menus: Menu[], userRoles: Observable<string[]>): Observable<Menu[]> {
    return userRoles.pipe(
      map(roles => {
        const allowedMenus: Menu[] = [];
        menus.forEach(menu => {
          if (menu.isAllowed(roles)) {
            menu.children = menu.children.filter(child => child.isAllowed(roles));
            allowedMenus.push(menu);
          }
        });
        return allowedMenus;
      })
    );
  }
}
