import { Component, Input, OnDestroy, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, map, takeUntil } from 'rxjs';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import {  MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { MenuTreeComponent } from '../menu-tree/menu-tree.component';
import { MatIconButton } from '@angular/material/button';
import { Menu } from './menu';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatSidenavModule, AsyncPipe, MatToolbarModule, MatIconModule, MatIconButton, RouterOutlet, MatNavList, MenuTreeComponent, MatSidenavContent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less'
})
export class MenuComponent implements OnDestroy {

  private readonly auth = inject(AuthService);
  private readonly menuService = inject(MenuService);
  menus = this.menuService.menus;
  SelectedMenu$ = this.menuService.SelectedMenu;
  private router: Router = inject(Router)
  private readonly breakpointObserver = inject(BreakpointObserver);
  destroyed = new Subject<void>();


  isXSmallScreen = this.breakpointObserver.observe([
    Breakpoints.XSmall,
  ]).pipe(takeUntil(this.destroyed),
    map(result => result.matches));

  logout() {
    this.auth.logout()
    this.router.navigateByUrl('/login')

  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}

