import { Component, inject, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router) { }

  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    } else {
      this.authService.getUserInfoFromApi().subscribe({
        next: (userInfo) => {
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['/']);
          }
        }
      });
    }
  }


  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;
    this.authService.login(this.f.uname!.value!, this.f.password!.value!).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed', error);
        // Handle login failure, e.g., show an error message
      }
    });
  }
}
