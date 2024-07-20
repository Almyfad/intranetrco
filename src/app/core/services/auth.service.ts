import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, concat, defer, delay, delayWhen, distinctUntilChanged, interval, map, of, retry, retryWhen, shareReplay, startWith, switchMap, takeUntil, tap, timer } from 'rxjs';
import { UserInfo, UserService } from '../../../osmose-api-client';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly osmose = inject(UserService)
  private readonly router = inject(Router)
  private stoPing$Subject = new Subject<void>();
  private UserInfos$Subject = new BehaviorSubject<UserInfo>({ isConnected: false, roles: [] });


  ping$: Observable<UserInfo> = concat(
    defer(() => this.osmose.apiUserInfosGet()), // dqsdqsdqsd
    interval(3000).pipe(
      switchMap(() => this.osmose.apiUserInfosGet()),
      retry({
        delay: error => {
          if (error.status === 401) {
            return timer(60000);
          }
          return timer(30000);
        }
      }),
      catchError(() => of({ isConnected: false, roles: [] }))
    )
  ).pipe(
    tap((ui) => {
      this.UserInfos$Subject.next(ui);
      if (ui.isConnected === false) {
        this.router.navigateByUrl('/login');
      }
    }),
    takeUntil(this.stoPing$Subject)
  );

  stopPing() {
    this.stoPing$Subject.next();
    this.stoPing$Subject.complete();
  }

  get UserInfo$(): Observable<UserInfo> { return this.UserInfos$Subject.pipe(shareReplay(1), distinctUntilChanged(
    (a, b) => a.isConnected === b.isConnected 
              && a.roles?.join("|") === b.roles?.join("|")
              && a.email === b.email
              && a.nom === b.nom
              && a.prenom === b.prenom
              && a.id === b.id
  )) }
  get isLogged$(): Observable<boolean> { return this.UserInfo$.pipe(map(ui => ui.isConnected ?? false)) }
  get UserRoles$(): Observable<string[]> { return this.UserInfo$.pipe(map(ui => ui.roles ?? [])) }

  login(payload: { email: string, password: string }): Observable<boolean> {
    return this.osmose.apiLoginPost({ email: payload.email, password: payload.password })
      .pipe(
        switchMap(() => this.osmose.apiUserInfosGet()),
        tap((ui) => {
          this.UserInfos$Subject.next(ui)
        }),
        map(ui => ui.isConnected ?? false),
        delay(1000))
  }

  logout() {
    // this._isLogged = false //addendpoint to remove cookie
  }
}
