import { Component, inject } from '@angular/core';
import { NextActivitiesComponent } from '../../components/next-activities/next-activities.component';
import { ConferencesService } from '../../core/services/conferences.service';
import { map, take } from 'rxjs';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NextActivitiesComponent,RouterOutlet,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent {
  private readonly confApi = inject(ConferencesService);
  Oconferences = this.confApi.conferences.pipe(
    map((confs) => confs.sort((a, b) => a.datedebut > b.datedebut ? 1 : -1).slice(0, 3)
))

  Oinscriptions = this.confApi.mesInscriptions.pipe(
    map((ins)=> ins.map((i)=>i.conference)),
    map((confs) => confs.sort((a, b) => a.datedebut > b.datedebut ? 1 : -1).slice(0, 3)
    ))
}
