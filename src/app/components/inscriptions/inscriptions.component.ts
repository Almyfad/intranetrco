import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject, lastValueFrom, map, switchMap } from 'rxjs';
import { Centre, Conference, HeureArrivee, HeureDepart, Inscription, Lit, ParticipationTache, TypeConference } from '../../core/models/models';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatAccordion, } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ConferenceExpansionPanelComponent } from '../conference-expansion-panel/conference-expansion-panel.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

enum FilterType { Centre, TypeConference, None }

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



  SubjectPattern = new BehaviorSubject<[FilterType, Centre | TypeConference] | undefined>(undefined);
  filteredConferences!: Observable<SkeletonValue<Conference>[]>;
  types!: Observable<SkeletonValue<TypeConference>[]>;
  centres!: Observable<SkeletonValue<Centre>[]>;

  ngOnInit(): void {
    this.filteredConferences = SkeletonValue.of<Conference>(this.SubjectPattern
      .pipe(switchMap((params: [FilterType, TypeConference | Centre] | undefined) => {
        const [type, filter] = params || [];
        return this.Oconferences.pipe(map(x => {
          if (type === FilterType.Centre) {
            return x.filter(x => filter === undefined || filter.id == 0 || x.centre.id === filter.id)
          }
          if (type === FilterType.TypeConference) {
            return x.filter(x => filter === undefined || filter.id == 0 || x.type.id === filter.id)
          }
          return x;
        }));
      })), 10)

    this.types = SkeletonValue.of<TypeConference>(this.Otypes.pipe(map(x => [{ id: 0, nom: "Tous" }, ...x])), 5)
    this.centres = SkeletonValue.of<Centre>(this.Ocentres.pipe(map(x => [{ id: 0, nom: "Tous" }, ...x])), 3)

  }

  selectCentre(centre: Centre | undefined) {
    if(centre === undefined) return;
    this.SubjectPattern.next([FilterType.Centre, centre])
  }

  selectType(type: TypeConference | undefined) {
    if(type === undefined) return;
    this.SubjectPattern.next([FilterType.TypeConference, type])
  }

  setInscriptionEvent(inscription: Inscription) {
    this.setInscription.emit(inscription)
  }

}
