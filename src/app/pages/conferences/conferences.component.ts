import { Component, OnInit, inject } from '@angular/core';
import { ConferencesService } from '../../core/services/conferences.service';
import { ConferencesListComponent } from '../../components/conferences-list/conferences-list.component';
import { CurrentMode, InscriptionConferenceService } from '../../core/services/inscription-conference.service';
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Centre, Conference, TypeConference } from '../../core/models/models';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { AsyncPipe } from '@angular/common';

enum FilterType { Centre, TypeConference, None }

@Component({
  selector: 'app-conferences',
  standalone: true,
  imports: [ConferencesListComponent, MatCard, MatCardContent, MatChipsModule, NgxSkeletonLoaderModule, AsyncPipe],
  templateUrl: './conferences.component.html',
  styleUrl: './conferences.component.less'
})
export class ConferencesComponent {
  private readonly confAPI = inject(ConferencesService);
  private readonly insService = inject(InscriptionConferenceService);

  SubjectPattern = new BehaviorSubject<[FilterType, Centre | TypeConference] | undefined>(undefined);

  Omesinscriptions = this.confAPI.mesInscriptions
    .pipe(
      tap(ins => { this.insService.mesinscriptions = ins }),
      map(ins => ins.map(i => i.conference)))

  Oconferences = combineLatest([this.confAPI.conferences, this.confAPI.mesInscriptions]).pipe(
    tap(_ => { this.insService.mesinscriptions = undefined }),
    map(([conf, ins]) => conf.filter(c => !ins.some(i => i.conference.id === c.id))));

  filteredConferences = this.SubjectPattern
    .pipe(switchMap((params) => {
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
    })
    );

  types = SkeletonValue.of<TypeConference>(this.confAPI.types.pipe(map(x => [{ id: 0, nom: "Tous", color: undefined, icon: undefined }, ...x])), 5)
  centres = SkeletonValue.of<Centre>(this.confAPI.centres.pipe(map(x => [{ id: 0, nom: "Tous" }, ...x])), 3)

  private readonly activatedRoute = inject(ActivatedRoute);
  isEditable =false
  isInscription = false

  get items() {
    if (this.activatedRoute.snapshot.data['mode'] === CurrentMode.ajoutInscription) {
      this.insService.mode = CurrentMode.ajoutInscription;
    }
    if (this.activatedRoute.snapshot.data['mode'] === CurrentMode.editInscription) {
      this.insService.mode = CurrentMode.editInscription;
    }
    this.isEditable = this.insService.isEditable
    this.isInscription = this.insService.isInscription
    return this.insService.mode === CurrentMode.editInscription ? this.Omesinscriptions : this.filteredConferences;

  }


  selectCentre(centre: Centre | undefined) {
    if (centre === undefined) return;
    this.SubjectPattern.next([FilterType.Centre, centre])
  }

  selectType(type: TypeConference | undefined) {
    if (type === undefined) return;
    this.SubjectPattern.next([FilterType.TypeConference, type])
  }


}
