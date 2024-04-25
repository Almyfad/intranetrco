import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject, lastValueFrom, map } from 'rxjs';
import { Centre, Conference, HeureArrivee, HeureDepart, Inscription, Lit, ParticipationTache, TypeConference } from '../../core/models/models';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatAccordion, } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ConferenceExpansionPanelComponent } from '../conference-expansion-panel/conference-expansion-panel.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-inscriptions',
  standalone: true,
  imports: [NgFor, NgIf, MatCard, MatCardContent, NgxSkeletonLoaderModule
    , AsyncPipe, MatAccordion, MatChipsModule, ConferenceExpansionPanelComponent],
  templateUrl: './inscriptions.component.html',
  styleUrl: './inscriptions.component.less'
})
export class InscriptionsComponent implements OnInit {
  @Input() Oconferences!: Observable<Conference[]>;
  @Input() Otypes!: Observable<TypeConference[]>;
  @Input() Ocentres!: Observable<Centre[]>;
  @Input() Olits!: Observable<Lit[]>;
  @Input() OheuresArrivee!: Observable<HeureArrivee[]>;
  @Input() OheuresDepart!: Observable<HeureDepart[]>;
  @Input() OparticipationTaches!: Observable<ParticipationTache[]>;
 
  
  @Output() setInscription = new EventEmitter<Inscription>();


  conferences!: Observable<Conference[]>;

  Sconferences: Subject<Conference[]> = new BehaviorSubject<Conference[]>([]);
  filteredConferences!: Observable<SkeletonValue<Conference>[]>;
  types!: Observable<SkeletonValue<TypeConference>[]>;
  centres!: Observable<SkeletonValue<Centre>[]>;

  ngOnInit(): void {
    this.Oconferences.subscribe({
      next: value => this.Sconferences.next(value),
    });
    this.conferences = this.Sconferences.asObservable()

    this.filteredConferences = SkeletonValue.of<Conference>(this.conferences, 10)

    this.types = SkeletonValue.of<TypeConference>(this.Otypes.pipe(map(x => [{ id: 0, nom: "Tous" }, ...x])), 5)
    this.centres = SkeletonValue.of<Centre>(this.Ocentres.pipe(map(x => [{ id: 0, nom: "Tous" }, ...x])), 3)

  }

  selectCentre(centre: Centre | undefined) {
    lastValueFrom(this.Oconferences)
      .then(x => this.Sconferences.next(x.filter(x => centre === undefined || centre.id == 0 || x.centre.id === centre.id)))

  }

  selectType(type: TypeConference | undefined) {
    lastValueFrom(this.Oconferences)
      .then(x => this.Sconferences.next(x.filter(x => type === undefined || type.id == 0 || x.type.id === type.id)))

  }

  setInscriptionEvent(inscription: Inscription) {
    this.setInscription.emit(inscription)
  }

}
