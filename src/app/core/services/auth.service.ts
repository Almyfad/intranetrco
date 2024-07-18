import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, switchMap, tap } from 'rxjs';
import { UserService } from '../../../osmose-api-client';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly osmose = inject(UserService)

  private roles: String[] = []
  private _isLogged: boolean = false;

  amiLogged(): Observable<boolean> {
    return this.osmose.apiUserInfoRolesGet().pipe(
      map((roles) => {
        this.roles = roles;
        this._isLogged = true;
        return true;
      }),
    );
  }

  login(payload: { email: string, password: string }): Observable<boolean> {
    return this.osmose.apiLoginPost({ email: payload.email, password: payload.password })
      .pipe(
        switchMap(() => this.osmose.apiUserInfoRolesGet()),
        tap((roles) => this.roles = roles),
        tap((_) => this._isLogged = true),
        map(() => true),
        delay(1000))
  }

  get isLogged(): boolean {
    return this._isLogged
  }

  logout() {
    this._isLogged = false
  }
}
