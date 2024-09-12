import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuTreeComponent } from "../components/menu-tree/menu-tree.component";
import { MenuService } from '../core/services/menu.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { trigger, style, transition, animate } from '@angular/animations';
import { Centre } from '../core/osmose-api-client';
import { ScrollService } from '../core/services/scroll.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  animations: [
    trigger('expand', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    MenuTreeComponent,
    MatTabsModule,
    RouterModule,
  ]
})
export class LayoutComponent implements AfterViewInit {
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);

  menus = this.menuService.Menus;
  SelectedMenu$ = this.menuService.SelectedMenu;
  centres = this.menuService.centres;
  tabsEnable = this.menuService.TabsEnable;
  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef;

  set selectedTabs(centre: Centre) {
    this.menuService.SelectedCenter = centre
  }

  ngAfterViewInit(): void {
    this.scrollableDiv.nativeElement.addEventListener('scroll', this.onDivScroll.bind(this));
  }

  onDivScroll(event: any): void {
    const element = event.target;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    this.scrollService.onScroll({
      scrollHeight,
      scrollTop: element.scrollTop,
      clientHeight: element.clientHeight
    });
  }


  isTabSelected(centre: Centre) {
    return this.menuService.isCentreActive(centre);
  }



  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


}
