import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, tap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MesconferencesComponent } from "./mesconferences/mesconferences.component";
import { DashboardService } from './dashboard.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MesconferencesComponent
  ]
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private readonly daschboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);

  username = this.authService.UserInfo$.pipe(map(user => user?.prenom ?? user?.email));


  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    tap(() => {
      console.log("tap")
    }),
    map(({ matches }) => {
      if (matches) {
        return {
          card1: { title: 'Card 1', cols: 1, rows: 1 },
          card2: { title: 'Prochaines Conf', cols: 1, rows: 1 },
          card3: { title: 'Card 3', cols: 1, rows: 1 },
          card4: { title: 'Autre Activitées', cols: 1, rows: 1 }
        }

      }
      return {
        card1: { title: 'Annonce', cols: 2, rows: 1 },
        card2: { title: 'Les Prochaines Conférences', cols: 1, rows: 1 },
        card3: { title: 'Mes Cotisations', cols: 1, rows: 2 },
        card4: { title: 'Autre Activitées', cols: 1, rows: 1 }
      }
    })
  );
}
