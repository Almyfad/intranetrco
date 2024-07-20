import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'intranetrco';
  private readonly authService = inject(AuthService);

  ngOnInit() {
   this.authService.ping$.subscribe()
  }
  ngOnDestroy() {
   this.authService.stopPing()
  }
}
