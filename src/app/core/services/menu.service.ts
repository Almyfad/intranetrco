import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { Module } from '../osmose-api-client';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private SelectedMenu$Subject = new BehaviorSubject<Module | undefined>(undefined);

  set SelectedMenu(menu: Module) {
    this.SelectedMenu$Subject.next(menu);
  }

  get SelectedMenu(): Observable<Module | undefined> {
    return this.SelectedMenu$Subject.pipe(shareReplay(1));
  }


  private readonly auth = inject(AuthService);

  get menus(): Observable<Module[]> {
    return this.auth.UserInfo$.pipe(
      map((userInfo) => {
        return (userInfo.modules ?? []) as [];
      }));

  }
  constructor() { }
}
