import { Component, Input, OnDestroy, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, map, takeUntil } from 'rxjs';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { MenuTreeComponent } from '../menu-tree/menu-tree.component';
import { MatIconButton } from '@angular/material/button';
import { OsmoseApiClientService } from '../../core/services/osmose-api-client.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatSidenavModule, AsyncPipe, MatToolbarModule, MatIconModule, MatIconButton, RouterOutlet, MatNavList, MenuTreeComponent, MatSidenavContent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less'
})
export class MenuComponent implements OnDestroy {
  @Input() menus: Menu[] = [];
  private readonly auth = inject(AuthService);
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
  get islogged() {
    return this.auth.isLogged;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}

export class Menu {
  label: string | undefined
  icon: string | undefined
  route: string | undefined
  roles: string[] = [];
  children: Menu[] = [];
  get hasChildren(): boolean {
    return this.children.length > 0;
  }

  constructor(label: string, icon: string, route: string, children: Menu[], roles: string[] = ["USER"]) {
    this.label = label;
    this.icon = icon;
    this.route = route;
    this.children = children;
  }
}
