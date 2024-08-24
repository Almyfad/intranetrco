import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SysAdminService } from '../../core/osmose-api-client';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './development.component.html',
  styleUrl: './development.component.scss'
})
export class DevelopmentComponent {

  private readonly sys = inject(SysAdminService)
  private readonly router = inject(Router);

  importusers() {
    throw new Error('Method not implemented.');
  }
  genactivities() {
    throw new Error('Method not implemented.');
  }
  loading = false;

  adminuser() { this.connectUser("admin2@rco.com") }
  usermanager() { this.connectUser("usermanager@rco.com") }
  standarUser() { this.connectUser("usercentre@rco.com") }


  connectUser(Email: string) {
    try {
      this.loading = true;
      this.sys.apiSysAdminImpersonateUsersGet(Email).subscribe()
      this.router.navigateByUrl('/');
    }
    finally {
      this.loading = false;
    }
  }

}
