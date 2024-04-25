import { Component, Input, OnInit } from '@angular/core';
import { HeureArrivee, HeureDepart, Inscription, Lit, ParticipationTache } from '../../core/models/models';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { ConferenceExpansionPanelComponent } from '../conference-expansion-panel/conference-expansion-panel.component';

@Component({
  selector: 'app-mes-inscriptions',
  standalone: true,
  imports: [NgFor, ConferenceExpansionPanelComponent, AsyncPipe,NgIf,MatAccordion],
  templateUrl: './mes-inscriptions.component.html',
  styleUrl: './mes-inscriptions.component.less'
})
export class MesInscriptionsComponent implements OnInit {
  @Input() Oinscriptions!: Observable<Inscription[]>;
  @Input() Olits!: Observable<Lit[]>;
  @Input() OheuresArrivee!: Observable<HeureArrivee[]>;
  @Input() OheuresDepart!: Observable<HeureDepart[]>;
  @Input() OparticipationTaches!: Observable<ParticipationTache[]>;
  mesinscriptions!: Observable<SkeletonValue<Inscription>[]>;

  ngOnInit(): void {
    this.mesinscriptions = SkeletonValue.of<Inscription>(this.Oinscriptions, 3)
  }

}
