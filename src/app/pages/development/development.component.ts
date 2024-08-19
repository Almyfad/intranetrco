import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SysAdminService } from '../../core/osmose-api-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule],
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
  adminuser() {
    try {
      this.loading = true;
      this.sys.apiSysAdminImpersonateUsersGet("admin2@rco.com").subscribe()
      this.router.navigateByUrl('/');
    }
    finally {
      this.loading = false;
    }
  }
  standarUser() {

  }

}
