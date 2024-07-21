import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LayoutComponent } from '../../layout/layout.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent,AsyncPipe],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy {
  title = 'intranetrco';
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.authService.ping$.subscribe()
  }
  ngOnDestroy() {
    this.authService.stopPing()
  }
}