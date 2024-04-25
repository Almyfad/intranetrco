import { Component, inject } from '@angular/core';
import { MesInscriptionsComponent } from '../mes-inscriptions/mes-inscriptions.component';
import { InscriptionsComponent } from '../inscriptions/inscriptions.component';
import { ConferencesService } from '../../core/services/conferences.service';
import { Inscription } from '../../core/models/models';
import { BehaviorSubject, switchMap } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MesInscriptionsComponent, InscriptionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  behaviourSubject = new BehaviorSubject<boolean>(true);
  private readonly confAPI = inject(ConferencesService);
  mesinscriptions = this.behaviourSubject.pipe(switchMap(_ => this.confAPI.getMesInscriptions()));
  conferences = this.confAPI.getConferences();
  types = this.confAPI.getTypes();
  centres = this.confAPI.getCentres();
  Olits = this.confAPI.lit;
  OheuresArrivee = this.confAPI.heuresArrivee;
  OheuresDepart = this.confAPI.HeuresDepart;
  OparticipationTaches = this.confAPI.ParticipationTaches;



  constructor(private _snackBar: MatSnackBar) { }
  setInscriptionEvent(inscription: Inscription) {
    this.confAPI.setInscription(inscription)
    .subscribe(x => {
      this.behaviourSubject.next(true)
      this._snackBar.open(`Vous êtes inscrit à ${inscription.conference.titre}`, "Fermer");
    });
  }
}
