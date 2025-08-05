import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Starter',
    iconName: 'home',
    bgcolor: 'primary',
    route: '/starter',
  },
  {
    navCap: 'Other',
  },
  {
    displayName: 'Menu Level',
    iconName: 'box-multiple',
    bgcolor: 'error',
    route: '/menu-level',
    children: [
      {
        displayName: 'Menu 1',
        iconName: 'point',
        bgcolor: 'tranparent',
        route: '/menu-1',
        children: [
          {
            displayName: 'Menu 1',
            iconName: 'point',
            bgcolor: 'tranparent',
            route: '/menu-1',
          },

          {
            displayName: 'Menu 2',
            iconName: 'point',
            bgcolor: 'tranparent',
            route: '/menu-2',
          },
        ],
      },

      {
        displayName: 'Menu 2',
        iconName: 'point',
        bgcolor: 'tranparent',
        route: '/menu-2',
      },
    ],
  },
  {
    displayName: 'Disabled',
    iconName: 'ban',
    route: '/disabled',
    disabled: true,
  },
  {
    displayName: 'Chip',
    iconName: 'mood-smile',
    route: '/',
    bgcolor: 'warning',
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: '9',
  },
  {
    displayName: 'Outlined',
    iconName: 'mood-smile',
    bgcolor: 'primary',
    route: '/',
    chip: true,
    chipClass: 'b-1 border-primary text-primary',
    chipContent: 'outlined',
  },
  {
    displayName: 'External Link',
    iconName: 'star',
    bgcolor: 'secondary',
    route: 'https://www.google.com/',
    external: true,
  },
];
