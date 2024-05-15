import { Component, OnDestroy, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { MatIconButton } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatIcon, MatIconButton, MatSidenavModule, MatNavList, MatListItem, RouterModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  destroyed = new Subject<void>();
  isXSmallScreen = this.breakpointObserver.observe([
    Breakpoints.XSmall,
  ]).pipe(takeUntil(this.destroyed),
    map(result => result.matches));



  logout() {
    console.log("logout")
    localStorage.removeItem('angular');
    window.location.href = '/login';
  }
  get islogged() {
    return this.auth.isLogged;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
