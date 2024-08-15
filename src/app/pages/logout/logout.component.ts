import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/osmose-api-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  private readonly UserService = inject(UserService);
  private router: Router = inject(Router)

  constructor() { }

  ngOnInit(): void {
    this.UserService.apiUserLogoutPost().subscribe(() => {
      this.router.navigateByUrl('/login')
    });
  }

}
