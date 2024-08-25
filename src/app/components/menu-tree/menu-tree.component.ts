import { Component, inject, Input } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MenuService } from '../../core/services/menu.service';
import { Module } from '../../core/osmose-api-client';

@Component({
  selector: 'app-menu-tree',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatIcon, MatIconButton, MatSidenavModule, MatNavList, MatListItem, RouterModule, MatSidenavContent
    , MatExpansionModule, AsyncPipe, CommonModule],
  templateUrl: './menu-tree.component.html',
  styleUrl: './menu-tree.component.scss',
})
export class MenuTreeComponent {
  @Input() menus: Observable<Module[]> = new Observable<Module[]>();
  private readonly menuService = inject(MenuService);

  onSelectMenu(menu: Module) {
    this.menuService.SelectedMenu = menu;
  };

  hasChildren = (menu: Module) => menu.sousMenus?.length ?? 0 > 0;

  ofSousMenus = (menu: Module) => of(menu.sousMenus ?? []);

  isActive(menu: Module): Observable<boolean> {
    return this.menuService.isModuleActive(menu);
  }

}


