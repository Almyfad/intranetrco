import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatIconModule, MatCardModule,MatButton, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  private readonly authService: AuthService = inject(AuthService);

  private router: Router = inject(Router)
  private builder: FormBuilder = inject(FormBuilder)
  loading = false;

  propEmail: FormControl = new FormControl<string>('george.bluth@reqres.in', [
    Validators.required,
    Validators.minLength(3),
  ])
  propPass: FormControl = new FormControl<string>('', [Validators.required])
  form: FormGroup = this.builder.group({
    email: this.propEmail,
    password: this.propPass
  })


  login() {
    if (this.form.invalid) return
    this.loading = true;
    this.authService.login(this.form.value).subscribe(() => {
      this.loading = false;
      this.router.navigateByUrl('/')
    })
  }
}
