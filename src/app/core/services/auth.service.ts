import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, tap } from 'rxjs';
import { OsmoseApiClientService } from './osmose-api-client.service';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly osmoseApiClientService = inject(OsmoseApiClientService)
  private readonly tokenService = inject(TokenService)

  login(payload: { email: string, password: string }): Observable<string> {
    return this.osmoseApiClientService.login(payload.email, payload.password)
      .pipe(
        tap((token) => this.tokenService.token = token),
        delay(1000),
      )
  }

  get isLogged(): boolean {
    return !!this.tokenService.token
  }
}
