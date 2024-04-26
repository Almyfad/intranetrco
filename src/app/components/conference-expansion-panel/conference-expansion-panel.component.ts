import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Conference, HeureArrivee, HeureDepart, Inscription, Lit, ParticipationTache } from '../../core/models/models';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, concat, map, mergeMap, of, tap } from 'rxjs';

@Component({
  selector: 'conference-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule, NgxSkeletonLoaderModule, AsyncPipe,
    ReactiveFormsModule, MatSelectModule,
    MatIcon, DatePipe, NgIf, NgFor, MatButton, MatInputModule],
  templateUrl: './conference-expansion-panel.component.html',
  styleUrl: './conference-expansion-panel.component.less'
})
export class ConferenceExpansionPanelComponent implements OnInit {
  @Input() SklValue!: SkeletonValue<Conference | Inscription>;
  private builder: FormBuilder = inject(FormBuilder)
  @Output() setInscription = new EventEmitter<Inscription>();

  @Input() OheuresArrivee!: Observable<HeureArrivee[]>
  @Input() OheuresDepart!: Observable<HeureArrivee[]>
  @Input() OparticipationTaches!: Observable<HeureArrivee[]>
  @Input() Olits!: Observable<HeureArrivee[]>
  panelOpenState = false;

  formIsLoading: Observable<boolean> = of(true)


  get isInscription(): boolean {
    let obj = this.SklValue.value;
    return obj !== null && typeof obj === 'object' && 'conference' in obj;
  }

  get isConference(): boolean {
    let obj = this.SklValue.value;
    return obj !== null && typeof obj === 'object' && 'centre' in obj;
  }

  get conference(): Conference {
    if (this.isConference) {
      return this.SklValue.value as Conference;
    } else {
      return (this.SklValue.value as Inscription).conference;
    }
  }

  get inscription(): Inscription | undefined {
    if (this.isInscription) return this.SklValue.value as Inscription;
    return undefined
  }
  get isEditable(): boolean { return this.isInscription }
  get isNew(): boolean { return this.isConference }


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

  ngOnInit(): void {
    this.formIsLoading = concat(of(true), this.OheuresArrivee.pipe(
      mergeMap(_ => this.OheuresDepart),
      mergeMap(_ => this.OparticipationTaches
        .pipe(tap(x => this.participationControl
          .setValue(this.inscription?.participation ?? x[0])))),
      mergeMap(_ => this.Olits
        .pipe(tap(x => this.litControl
          .setValue(this.inscription?.lit ?? x[0])))),
      map(() => false)))



    this.propDescription.setValue(this.inscription?.description)
    this.heureArriveeControl.setValue(this.inscription?.heureArrivee)
    this.heureDepartControl.setValue(this.inscription?.heureDepart)



  }

  subscribe() {
    if (this.form.invalid) return
    console.log("form", this.form.value)
    this.setInscription.emit({
      isnew: this.isNew,
      id: this.inscription?.id,
      conference: this.conference,
      ...this.form.value,
    })
  }

}
