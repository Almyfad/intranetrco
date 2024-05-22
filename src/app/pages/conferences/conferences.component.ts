import { Component, inject } from '@angular/core';
import { ConferencesService } from '../../core/services/conferences.service';
import { ConferencesListComponent } from '../../components/conferences-list/conferences-list.component';
import { CurrentMode, InscriptionConferenceService } from '../../core/services/inscription-conference.service';
import { combineLatest, map, mergeMap, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-conferences',
  standalone: true,
  imports: [ConferencesListComponent],
  templateUrl: './conferences.component.html',
  styleUrl: './conferences.component.less'
})
export class ConferencesComponent {
  private readonly confAPI = inject(ConferencesService);
  private readonly insService = inject(InscriptionConferenceService);

  Omesinscriptions = this.confAPI.mesInscriptions
    .pipe(
      tap(ins => { this.insService.mesinscriptions = ins }),
      map(ins => ins.map(i => i.conference)))

  Oconferences = combineLatest([this.confAPI.conferences, this.confAPI.mesInscriptions]).pipe(
    tap(_ => { this.insService.mesinscriptions = undefined }),
    map(([conf, ins]) => conf.filter(c => !ins.some(i => i.conference.id === c.id))));


  private readonly activatedRoute = inject(ActivatedRoute);

  get items() {
    if (this.activatedRoute.snapshot.data['mode'] === CurrentMode.ajoutInscription) {
      this.insService.mode = CurrentMode.ajoutInscription;
    }
    if (this.activatedRoute.snapshot.data['mode'] === CurrentMode.editInscription) {
      this.insService.mode = CurrentMode.editInscription;
    }
    return this.insService.mode === CurrentMode.editInscription ? this.Omesinscriptions : this.Oconferences;

  }
}
