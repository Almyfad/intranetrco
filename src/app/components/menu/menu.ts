export class Menu {
  label: string
  icon: string
  route: string
  roles: string[];
  children: Menu[] = [];
  get hasChildren(): boolean {
    return this.children.length > 0;
  }

  constructor(label: string, icon: string, route: string, children: Menu[], roles: string[] = ["USER"]) {
    this.label = label;
    this.icon = icon;
    this.route = route;
    this.children = children;
    this.roles = roles;
  }

  isAllowed(userRoles: string[]): boolean {
    // Check if any of the menu's roles match any of the user's roles
    console.log("isAllowed.menuroles",this.label, this.roles)
    return this.roles.some(menuRole => userRoles.includes(menuRole));
  }

  getAllowedChildren(userRoles: string[]): Menu[] {
    // Filter children based on user's roles, and then recursively apply to sub-children
    return this.children
      .filter(child => child.isAllowed(userRoles))
      .map(child => {
        // Recursively filter sub-children
        child.children = child.getAllowedChildren(userRoles);
        return child;
      });
  }

  getAllowed(userRoles: string[]): Menu {
    const menu = new Menu(this.label, this.icon, this.route, this.children, this.roles);
    menu.children = menu.getAllowedChildren(userRoles);
    return menu;
  }

  static getAllowedMenus(menus: Menu[], userRoles: string[]): Menu[] {
    console.log("useroles", userRoles)
    return menus
      .filter(menu => menu.isAllowed(userRoles))
      .map(menu => menu.getAllowed(userRoles));
  }
}
