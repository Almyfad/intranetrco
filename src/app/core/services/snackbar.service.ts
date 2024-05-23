import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private readonly _snackBar = inject(MatSnackBar);
  constructor() { }

  success(message: string): void {
    this._snackBar.open(message, undefined, {
      duration: 2000,  
      panelClass: ['app-notification-success']
    });
  }

  error(message: string): void {
    this._snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: ['app-notification-error']
    });
  }
}
