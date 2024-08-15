import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, concat, defer, delay, delayWhen, distinctUntilChanged, interval, map, of, retry, retryWhen, shareReplay, startWith, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Router } from '@angular/router';
import { UserInfo, UserService } from '../osmose-api-client';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService)
  private readonly router = inject(Router)
  private stoPing$Subject = new Subject<void>();
  private UserInfos$Subject = new BehaviorSubject<UserInfo>({ isConnected: false });

  
    ping$: Observable<UserInfo> = concat(
      defer(() => this.userService.apiUserUserInfosGet()),
      interval(30000).pipe(
        switchMap(() => this.userService.apiUserUserInfosGet()),
        retry({
          delay: error => {
            if (error.status === 401) {
              return timer(60000);
            }
            return timer(30000);
          }
        })
      )
    ).pipe(
      tap((ui) => {
        this.UserInfos$Subject.next(ui);
        if (ui.isConnected === false) {
          this.router.navigateByUrl('/login');
        }
      }),
      catchError(() => {
        this.UserInfos$Subject.next({ isConnected: false});
        this.router.navigateByUrl('/login');
        return of({ isConnected: false, roles: [] })
      }),
      takeUntil(this.stoPing$Subject)
    );
  
    stopPing() {
      this.stoPing$Subject.next();
      this.stoPing$Subject.complete();
    }
   
    get UserInfoGuard$(): Observable<UserInfo> {
      return this.userService.apiUserUserInfosGet().pipe(
        tap((ui) => {
          this.UserInfos$Subject.next(ui);
          if (ui.isConnected === false) {
            this.router.navigateByUrl('/login');
          }
        }),
        catchError(() => {
          this.UserInfos$Subject.next({ isConnected: false });
          this.router.navigateByUrl('/login');
          return of({ isConnected: false})
        }))
    }
  
    
    get UserInfo$(): Observable<UserInfo> {
  
      return this.UserInfos$Subject.pipe(shareReplay(1),
        distinctUntilChanged(
          (a, b) => a.isConnected === b.isConnected          
            && a.email === b.email
            && a.nom === b.nom
            && a.prenom === b.prenom
        ),
      )
    }
  
    
    get isLogged$(): Observable<boolean> { return this.UserInfo$.pipe(
      map(ui => ui.isConnected ?? false)
    ); }
  
  login(payload: { email: string, password: string }): Observable<boolean> {
    return this.userService.apiUserLoginPost({ email: payload.email, password: payload.password })
      .pipe(
        switchMap(() => this.userService.apiUserUserInfosGet()),
        tap((ui) => {
          this.UserInfos$Subject.next(ui)
        }),
        map(ui => ui.isConnected ?? false))
  }

  logout() {
    this.userService.apiUserLogoutPost().subscribe()
  }


}
