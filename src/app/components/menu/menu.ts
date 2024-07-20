import { Title } from "@angular/platform-browser";
import { Observable, map, of } from "rxjs";


interface MenuOptions {
  label: string;
  icon: string;
  route: string;
  children?: Menu[];
  roles?: string[];
  title?: Title; 
}

export class Menu {
  label: string
  icon: string
  route: string
  roles: string[];
  title: Title | undefined;
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
    this.children = options.children || []; 
    this.roles = options.roles || ["USER"]; 
    this.title = options.title; 
  }

 isAllowed(userRoles: string[]): boolean {
    return this.roles.some(menuRole => userRoles.includes(menuRole));
  }

  getAllowedChildren(userRoles: string[]): Menu[] {
    return this.children
      .filter(child => child.isAllowed(userRoles))
      .map(child => {
        child.children = child.getAllowedChildren(userRoles);
        return child;
      });
  }

  getAllowed(userRoles: string[]): Menu {
    return {
      ...this, 
      children: this.getAllowedChildren(userRoles)
    };
  }

  static getAllowedMenus(menus: Menu[], userRoles: Observable<string[]>): Observable<Menu[]> {
    return userRoles.pipe(map(roles => {
      return menus
        .filter(menu => menu.isAllowed(roles))
        .map(menu => menu.getAllowed(roles));
    }));
  }
}
