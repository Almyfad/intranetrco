import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatCardModule, MatButton, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent implements OnInit,OnDestroy {
  private readonly authService: AuthService = inject(AuthService);
  private readonly _snackBar = inject(SnackbarService);

  private router: Router = inject(Router)
  private builder: FormBuilder = inject(FormBuilder)
  loading = false;

  propEmail: FormControl = new FormControl<string>('test@test.com', [
    Validators.required,
    Validators.minLength(3),
  ])
  propPass: FormControl = new FormControl<string>('', [Validators.required])
  form: FormGroup = this.builder.group({
    email: this.propEmail,
    password: this.propPass
  })

  ngOnInit() {
    this.authService.ping$.subscribe()
    this.authService.isLogged$.subscribe((isLogged) => {
      if (isLogged) {
        this.router.navigateByUrl('/')
      }
    })
  }
  ngOnDestroy() {
    this.authService.stopPing()
  }

  login() {
    if (this.form.invalid) return
    this.loading = true;

    this.authService.login(this.form.value).subscribe({
      next: (v) => {
        if (v)
          this.router.navigateByUrl('/')
        this.loading = false;
      },
      error: (e ) => {
        this.loading = false
        this._snackBar.error(e.error?.message ?? 'Erreur de connexion')
      },
      complete: () => this.loading = false
    })
  }



}


