import { computed, inject, Injectable, signal } from '@angular/core';
import { UserInfo, UserService } from '../core/helios-api-client';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private readonly userService = inject(UserService)
  private readonly router = inject(Router);
  private readonly _currentUser = signal<UserInfo>({});
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoggedIn = computed(() => this._currentUser().isConnected || false);


  login(email: string, password: string): Observable<any> {
    return this.userService.apiUserLoginPost({ email: email, password }).pipe(
      switchMap(() => this.getUserInfo())
    );
  }

  logout(): Observable<any> {
    return this.userService.apiUserLogoutPost().pipe(
      tap(() => {
        this._currentUser.set({});
        this.router.navigate(['/authentication/login']);
      })
    );
  }

  getUserInfo(): Observable<UserInfo> {  
    return this.userService.apiUserInfosGet().pipe(
      tap((userInfo) => {
        this._currentUser.set(userInfo);
      })
    );
  }
}
