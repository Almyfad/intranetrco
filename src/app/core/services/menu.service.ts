import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, map, mergeMap, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Centre, Module, UserInfo } from '../osmose-api-client';


export type TabType = 'Centre' | 'none';
export class Tab {
  constructor() {

  }
  tab: Centre | undefined = undefined;
  libelle: string = ''
  hash: string = '';
  type: TabType = 'none';

  get isCentre(): boolean {
    return this.type === 'Centre'
  }

  static TabsCentre(centre: Centre[]): Tab[] {
    return centre.map((c) => {
      const tab = new Tab();
      tab.libelle = c.libelle ?? '';
      tab.type = 'Centre';
      tab.tab = c;
      tab.hash = `${typeof (c)}_${c.id}`;
      return tab;
    });
  }

}


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private SelectedMenu$Subject = new BehaviorSubject<Module | undefined>(undefined);
  private SelectedTab$Subject = new BehaviorSubject<Tab | undefined>(undefined);
  private SelectedCenter$Subject = new BehaviorSubject<Centre | undefined>(undefined);
  private Menus$Subject = new BehaviorSubject<Module[]>([]);
  private Tabs$Subject = new BehaviorSubject<Tab[]>([]);


  get selectedCenter(): Centre {
    return this.SelectedCenter$Subject.value!;
  }
  public selectedCenter$: Observable<Centre | undefined> = this.SelectedCenter$Subject.asObservable();


  getmenus(): Observable<UserInfo> {
    return this.auth.UserInfo$.pipe(
      tap((userInfo) => {
        if (!userInfo.isConnected) return;

        if (this.SelectedTab$Subject.value === undefined) {
          if (userInfo.centreModules && userInfo.centreModules[0].centre)
            this.selectedTab(this.Tabs$Subject.value[0], false)
        }

        if (this.SelectedMenu$Subject.value === undefined) {
          if (userInfo.centreModules && userInfo.centreModules[0].modules)
            this.SelectedMenu = userInfo.centreModules[0].modules[0]
        }

        this.Menus = [
          ...(userInfo.centreModules?.filter((m) => m.centre.id === this.SelectedCenter$Subject.value?.id)
            .map((m) => m.modules ?? []).flat()) || [],
          ...userInfo.sysAdminModules ?? [],
          ...userInfo.adminModules ?? [],
        ].sort((a, b) => a.id! - b.id!)

      }),
    )

  }
  constructor() {
    this.getmenus().subscribe()

  }
  get TabsEnable(): Observable<Boolean> {
    return this.Tabs$Subject.pipe(
      map((tabs) => tabs?.length > 0 ? true : false))
  }

  get Tabs(): Observable<Tab[]> {
    return this.Tabs$Subject.pipe(shareReplay(1));
  }

  configureTabs() {
    this.centres.pipe(
      tap((centres) => {
        let code = this.SelectedMenu$Subject.value?.code
        console.log("configureTabs============>", code)
        if (code === 'CreateConference')
          return this.Tabs$Subject.next(Tab.TabsCentre(centres.filter((c) => c.typeCentre.code === 'Renouvellement')))

        if (code === 'Accueil'
          || code === 'ConferencesInscriptions' || code === 'ConferencesUserInscriptions' || code === 'Conferences'
          || code === 'Registre' || code === 'RegistreFicheEleves'
          || code === 'Administation' || code === 'Developpement') return this.Tabs$Subject.next([])

        return this.Tabs$Subject.next(Tab.TabsCentre(centres))
      })
    ).subscribe()
  }

  set Menus(menu: Module[]) {
    this.Menus$Subject.next(menu);
  }
  get Menus(): Observable<Module[]> {
    return this.Menus$Subject.pipe(shareReplay(1));
  }

  set SelectedMenu(menu: Module) {
    this.SelectedMenu$Subject.next(menu);
    this.configureTabs();
  }

  get SelectedMenu(): Observable<Module | undefined> {
    return this.SelectedMenu$Subject.pipe(shareReplay(1));
  }

  selectedTab(tab: Tab, emitEventMenu: boolean = true) {
    this.SelectedTab$Subject.next(tab);
    if (tab?.isCentre) this.SelectedCenter$Subject.next(tab.tab)
    if (emitEventMenu) this.getmenus().subscribe()

  }
  set SelectedTab(tab: Tab) {
    this.selectedTab(tab)
  }
  get SelectedTab(): Observable<Tab | undefined> {
    return this.SelectedTab$Subject.pipe(shareReplay(1));
  }



  isModuleActive(menu: Module): Observable<boolean> {
    return this.SelectedMenu$Subject.pipe(
      map((selectedMenu) => selectedMenu?.id === menu.id)
    );
  }

  isTabActive(tab: Tab): Observable<boolean> {
    return this.SelectedTab$Subject.pipe(
      map((t) => tab.hash === t?.hash)
    );
  }

  private readonly auth = inject(AuthService);


  get centres(): Observable<Centre[]> {
    return this.auth.UserInfo$.pipe(
      shareReplay(1),
      map((userInfo) => userInfo.centreModules?.map((m) => m.centre) ?? []),
      tap((centres) => {
        if (this.SelectedCenter$Subject.value === undefined)
          this.SelectedCenter$Subject.next(centres[0])
      })
    )
  }

}
