import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SysAdminService } from '../../core/osmose-api-client';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLoadingComponent } from '../../components/button-loading/button-loading.component';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule, MatIconModule, ButtonLoadingComponent],
  templateUrl: './development.component.html',
  styleUrl: './development.component.scss'
})
export class DevelopmentComponent {

  private readonly sys = inject(SysAdminService)
  private readonly router = inject(Router);


  loading = false;

  get adminuser() { return this.sys.apiSysAdminImpersonateUsersGet("admin2@rco.com") }
  get usermanager() { return this.sys.apiSysAdminImpersonateUsersGet("usermanager@rco.com") }
  get standarUser() { return this.sys.apiSysAdminImpersonateUsersGet("usercentre@rco.com") }
  get importusers() { return this.sys.apiSysAdminGenerateUsersGet() }
  get generateactivities() { return this.sys.apiSysAdminGenerateActivitiesPost(50) }
  get generateMailingList() { return this.sys.apiSysAdminGenerateMailingListGet() }


}
