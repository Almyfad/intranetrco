import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

type AuthTokenResponse = {
  token: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private readonly url = 'https://reqres.in/api/login'


  login(payload: { email: string, password: string }): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(this.url, payload)
      .pipe(
        tap((res: AuthTokenResponse) => {
            this.token = res.token
        }),
      )
  }

  set token(value: string) {
    localStorage.setItem('angular', value)
  }

  get token() {
    return localStorage.getItem('angular') as string
  }

  get isLogged() {
    return !!this.token
  }
}
