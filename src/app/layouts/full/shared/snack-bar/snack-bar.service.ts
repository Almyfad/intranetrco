import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event, NavigationEnd, Router } from '@angular/router';
import { SnackBarComponent } from './snack-bar.component';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
    private readonly snackBar = inject(MatSnackBar);

  constructor(private router: Router) {
  }

  success(message: string): void {
      this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message, icon: 'circle-check' },
      duration: 3000,
      horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-bar-success']
        });
    }

    error(message: string): void {
        this.snackBar.openFromComponent(SnackBarComponent, {
            data: { message, icon: 'circle-x' },
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-bar-error']
        });
    }
    

    warning(message: string): void {
        this.snackBar.openFromComponent(SnackBarComponent, {
            data: { message, icon: 'alert-triangle' },
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-bar-warning']
        });
    }

    info(message: string): void {
        this.snackBar.openFromComponent(SnackBarComponent, {
            data: { message, icon: 'info-circle' },
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-bar-info']
        });
    }
}
