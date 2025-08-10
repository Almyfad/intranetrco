import { computed, inject, Injectable, signal } from '@angular/core';
import { UserInfo, UserService } from '../core/helios-api-client';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'userInfo';

  constructor() {
    // Charger les données depuis le session storage au démarrage
    this.loadUserFromStorage();
    this.getUserInfoFromApi().subscribe();
  }

  private readonly userService = inject(UserService)
  private readonly router = inject(Router);
  private readonly _currentUser = signal<UserInfo>({});
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoggedIn = computed(() => this._currentUser().isConnected || false);


  login(email: string, password: string): Observable<any> {
    return this.userService.apiUserLoginPost({ email: email, password }).pipe(
      switchMap(() => this.getUserInfoFromApi())
    );
  }

  logout(): Observable<any> {
    return this.userService.apiUserLogoutPost().pipe(
      tap(() => {
        this._currentUser.set({});
        this.clearUserFromStorage();
        this.router.navigate(['/authentication/login']);
      })
    );
  }


  getUserInfoFromApi(): Observable<UserInfo> {  
    return this.userService.apiUserInfosGet().pipe(
      tap((userInfo) => {
        this._currentUser.set(userInfo);
        this.saveUserToStorage(userInfo);
      })
    );
  }

  private saveUserToStorage(userInfo: UserInfo): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans le session storage:', error);
    }
  }

  private loadUserFromStorage(): void {
    try {
      const storedUser = sessionStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        const userInfo: UserInfo = JSON.parse(storedUser);
        this._currentUser.set(userInfo);
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis le session storage:', error);
      this.clearUserFromStorage();
    }
  }

  private clearUserFromStorage(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du session storage:', error);
    }
  }
}
