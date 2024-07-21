import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LayoutComponent } from './layout/layout.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent,AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'intranetrco';
  private readonly authService = inject(AuthService);

  isLogged$ = this.authService.isLogged$;

  ngOnInit() {
    this.authService.ping$.subscribe()
  }
  ngOnDestroy() {
    this.authService.stopPing()
  }
}

