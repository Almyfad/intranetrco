import { inject, Injectable } from '@angular/core';
import { Configuration, LoginRequest, UserService, Utilisateur } from '../../../osmose-api-client';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OsmoseApiClientService {
  private readonly UserService = inject(UserService)

  constructor() {


  }
  public createUser(utilisateur: Utilisateur): Observable<number> {
    return this.UserService.apiCreatePost(utilisateur);
  }
  public generate(): Observable<number> {
    return this.UserService.apiGeneratePost();
  }

  public login(email: string, password: string): Observable<string> {
    return this.UserService.apiLoginPost({ email: email, password: password });
  }
}
