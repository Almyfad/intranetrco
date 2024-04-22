import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, tap } from 'rxjs';

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
        delay(1000)
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
