import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeureArrivee, HeureDepart, ParticipationTache, Lit, Inscription, Conference } from '../../core/models/models';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ConferencesService } from '../../core/services/conferences.service';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentMode, InscriptionConferenceService } from '../../core/services/inscription-conference.service';
import { Router } from '@angular/router';
import { Observable, concat, map, mergeMap, of, tap } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-inscription-conference-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButton, MatInputModule, MatIcon, MatCard, MatCardContent,DatePipe,
    MatLabel, MatSelectModule, AsyncPipe, NgFor, NgIf, NgxSkeletonLoaderModule],
  templateUrl: './inscription-conference-form.component.html',
  styleUrl: './inscription-conference-form.component.less'
})
export class InscriptionConferenceFormComponent implements OnInit {
  private insService = inject(InscriptionConferenceService)
  private readonly _snackBar = inject(MatSnackBar);
  private readonly router = inject(Router)

  get isEditable(): boolean { return this.insService.isEditable }
  get isInscription(): boolean { return this.insService.isInscription }
  get conference(): Conference | undefined { return this.insService.conference }


  private builder: FormBuilder = inject(FormBuilder)
  formIsLoading: Observable<boolean> = of(true)

  propDescription: FormControl = new FormControl<string>('', [])
  heureArriveeControl: FormControl = new FormControl<HeureArrivee | undefined>(undefined, [])
  heureDepartControl: FormControl = new FormControl<HeureDepart | undefined>(undefined, [])
  participationControl: FormControl = new FormControl<ParticipationTache | undefined>(undefined, [])
  litControl: FormControl = new FormControl<Lit | undefined>(undefined, [])

  form: FormGroup = this.builder.group({
    description: this.propDescription,
    heureArrivee: this.heureArriveeControl,
    heureDepart: this.heureDepartControl,
    participation: this.participationControl,
    lit: this.litControl
  })
  private readonly confAPI = inject(ConferencesService);

  Otypes = this.confAPI.types;
  Ocentres = this.confAPI.centres;
  Olits = this.confAPI.lit;
  OheuresArrivee = this.confAPI.heuresArrivee;
  OheuresDepart = this.confAPI.HeuresDepart;
  OparticipationTaches = this.confAPI.ParticipationTaches;

  centres = SkeletonValue.of(this.Ocentres, 3);
  types = SkeletonValue.of(this.Otypes, 3);
  ngOnInit(): void {
    this.formIsLoading = concat(of(true), this.OheuresArrivee.pipe(
      mergeMap(_ => this.OheuresDepart),
      mergeMap(_ => this.OparticipationTaches
        .pipe(tap(x => this.participationControl
          .setValue(this.insService.inscription?.participation ?? x[0])))),
      mergeMap(_ => this.Olits
        .pipe(tap(x => this.litControl
          .setValue(this.insService.inscription?.lit ?? x[0])))),
      map(() => false)))


    this.propDescription.setValue(this.insService.inscription?.description)
    this.heureArriveeControl.setValue(this.insService.inscription?.heureArrivee)
    this.heureDepartControl.setValue(this.insService.inscription?.heureDepart)

  }


  subscribe() {
    if (this.form.invalid) return
    if (this.isInscription) {
      this.setInscription({
        conference: this.insService.conference,
        ...this.form.value,
      })
    }

    if (this.isEditable) {
      this.updateInscriptionEvent({
        id: this.insService.inscription?.id || 0,
        conference: this.insService.conference,
        ...this.form.value,
      })
    }
    this.router.navigateByUrl('/mesinscriptions')

  }

  setInscription(inscription: Inscription) {
    this.confAPI.setInscription(inscription)
      .subscribe({
        next: _ => {
          this._snackBar.open(`Vous êtes inscrit à ${inscription.conference.titre}`, "Fermer", { duration: 2000 });
          this.insService.reset();
        }, error: err => {
          this._snackBar.open(err.message, "Fermer", { duration: 2000 });
        }
      });
  }

  updateInscriptionEvent(inscription: Inscription) {
    this.confAPI.updateInscription(inscription)
      .subscribe({
        next: _ => {
          this._snackBar.open(`Votre inscrption à ${inscription.conference.titre} a été modifier`, "Fermer", { duration: 2000 });
          this.insService.reset();
        },
        error: err => {
          this._snackBar.open(err.message, "Fermer", { duration: 2000 });
        }
      });

  }


}
