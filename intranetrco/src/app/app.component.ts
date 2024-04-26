import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIcon, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'intranetrco';

  private readonly auth = inject(AuthService);

  get islogged() {
    return this.auth.isLogged;
  }

  logout() {
    console.log("logout")
    localStorage.removeItem('angular');
    window.location.href = '/login';
  }
}
