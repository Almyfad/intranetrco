import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, map, mergeMap, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Centre, Module, UserInfo } from '../osmose-api-client';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private SelectedMenu$Subject = new BehaviorSubject<Module | undefined>(undefined);
  private SelectedCenter$Subject = new BehaviorSubject<Centre | undefined>(undefined);
  private Menus$Subject = new BehaviorSubject<Module[]>([]);
  private TabsEnable$Subject = new BehaviorSubject<Boolean>(false);


  getmenus(): Observable<UserInfo> {
    return this.auth.UserInfo$.pipe(
      tap((userInfo) => {
        if (!userInfo.isConnected) return;

        if (this.SelectedCenter$Subject.value === undefined) {
          if (userInfo.centreModules && userInfo.centreModules[0].centre)
            this.SelectedCenter = userInfo.centreModules[0].centre
        }

        if (this.SelectedMenu$Subject.value === undefined) {
          if (userInfo.centreModules && userInfo.centreModules[0].modules)
            this.SelectedMenu = userInfo.centreModules[0].modules[0]
        }

        this.Menus = [
          ...this.publicModules,
          ...(userInfo.centreModules?.filter((m) => m.centre.id === this.SelectedCenter$Subject.value?.id)
            .map((m) => m.modules ?? []).flat()) || [],
          ...userInfo.sysAdminModules ?? [],
          ...userInfo.adminModules ?? [],
          { id: 10001, icon: 'logout', label: 'Déconnection', path: '/logout' },
        ]

      }),
    )

  }


  constructor() {
    console.log('MenuService Ctor is called')
    this.getmenus().subscribe()

  }

  _enabletabs(menu: Module) {
    if (menu.code === 'Accueil'
      || menu.code === 'ConferencesInscriptions' || menu.code === 'ConferencesUserInscriptions' || menu.code === 'Conferences'
      || menu.code === 'Registre' || menu.code === 'RegistreFicheEleves' 
      || menu.code === 'Administation' || menu.code === 'Developpement'
    )
      this.TabsEnable = false
    else
      this.TabsEnable = true
  }

  set Menus(menu: Module[]) {
    this.Menus$Subject.next(menu);
  }
  get Menus(): Observable<Module[]> {
    return this.Menus$Subject.pipe(shareReplay(1));
  }

  set SelectedMenu(menu: Module) {
    this.SelectedMenu$Subject.next(menu);
    this._enabletabs(menu);
  }

  get SelectedMenu(): Observable<Module | undefined> {
    return this.SelectedMenu$Subject.pipe(shareReplay(1));
  }

  set SelectedCenter(center: Centre) {
    this.SelectedCenter$Subject.next(center);
    this.getmenus().subscribe()
  }
  get SelectedCenter(): Observable<Centre | undefined> {
    return this.SelectedCenter$Subject.pipe(shareReplay(1));
  }

  set TabsEnable(enable: Boolean) {
    this.TabsEnable$Subject.next(enable);
  }
  get TabsEnable(): Observable<Boolean> {
    return this.TabsEnable$Subject.pipe(shareReplay(1));
  }

  isModuleActive(menu: Module): Observable<boolean> {
    return this.SelectedMenu$Subject.pipe(
      map((selectedMenu) => selectedMenu?.id === menu.id)
    );
  }

  isCentreActive(centre: Centre): Observable<boolean> {
    return this.SelectedCenter$Subject.pipe(
      map((selectedCentre) => selectedCentre?.id === centre.id)
    );
  }

  private readonly auth = inject(AuthService);


  get publicModules(): Module[] {
    return [
      {
        label: "Accueil",
        path: "/",
        parentId: null,
        sousMenus: [],
        icon: "home",
        title: "Bienvenue dans votre Espace Intranet",
        prefixIcon: "grass",
        suffixIcon: "grass",
        id: 1000,
        description: null,
        code: 'Accueil',
        creation: "2024-08-18T05:35:02",
        modification: null
      },
      {
        id: 2000,
        label: "Conferences",
        path: "/conferences",
        parentId: null,
        icon: "temple_buddhist",
        title: null,
        prefixIcon: null,
        suffixIcon: null,
        sousMenus: [
          {
            label: "Inscription",
            path: "/conferences/inscription",
            parentId: 2000,
            sousMenus: null,
            icon: "add",
            title: null,
            prefixIcon: null,
            suffixIcon: null,
            id: 2100,
            description: null,
            code: 'ConferencesInscriptions',
            creation: "2024-08-18T05:35:02",
            modification: null
          },
          {
            label: "Mes Inscriptions",
            path: "/mesinscriptions",
            parentId: 2000,
            sousMenus: null,
            icon: "edit",
            title: null,
            prefixIcon: null,
            suffixIcon: null,
            id: 2200,
            description: null,
            code: 'ConferencesUserInscriptions',
            creation: "2024-08-18T05:35:02",
            modification: null
          }
        ],
      }
    ]
  }



  get centres(): Observable<Centre[]> {
    return this.auth.UserInfo$.pipe(
      map((userInfo) => userInfo.centreModules?.map((m) => m.centre) ?? [])
    )
  }

}
