import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor() { }
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.logout().subscribe();
  }

}
