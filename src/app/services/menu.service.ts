import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { AuthService } from './auth.service';
import { CentreInfos, CentreModule, Module } from '../core/helios-api-client';
import { NavItem } from '../layouts/full/vertical/sidebar/nav-item/nav-item';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  private readonly authService = inject(AuthService);
  private readonly _currentCentre = signal<CentreInfos | undefined>(undefined);

  readonly centresModules: Signal<CentreModule[]> = computed(() => {
    return this.authService.currentUser()?.centreModules || [];
  });
  readonly adminModules: Signal<Module[]> = computed(() => {
    return this.authService.currentUser()?.adminModules || [];
  });

  readonly sysAdminModules: Signal<Module[]> = computed(() => {
    return this.authService.currentUser()?.sysAdminModules || [];
  });
  readonly centre: Signal<CentreInfos | undefined> = computed(() => {
    return this._currentCentre() ?? this.authService.currentUser()?.centreModules?.[0]?.centre ?? undefined;
  });

  readonly navItems: Signal<NavItem[]> = computed(() => {
    const centreModule = this.centresModules()
    .filter( x => x.centre.code === this.centre()?.code)[0];
    if(!centreModule) {
      return [];
    }
    return (centreModule.modules ?? []).map(module => {
      return {
        displayName: module.label,
        iconName: module.icon || 'circle',
        route: module.path,
        navCap: module.title,
        children: module.sousMenus?.map(subMenu => ({
          displayName: subMenu.label,
          iconName: subMenu.icon || 'circle',
          route: subMenu.path,
          navCap: subMenu.title
        })) || []
      } as NavItem;
    });
  });


}