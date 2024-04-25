import { Component, Input, OnInit, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Conference, Inscription } from '../../core/models/models';
import { DatePipe, NgIf } from '@angular/common';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'conference-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule, NgxSkeletonLoaderModule,
    ReactiveFormsModule, MatSelectModule,
    MatIcon, DatePipe, NgIf, MatButton, MatInputModule],
  templateUrl: './conference-expansion-panel.component.html',
  styleUrl: './conference-expansion-panel.component.less'
})
export class ConferenceExpansionPanelComponent {
  @Input() SklValue!: SkeletonValue<Conference | Inscription>;
  private builder: FormBuilder = inject(FormBuilder)



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
  get isEditable(): boolean { return this.isInscription }
  get isNew(): boolean { return this.isConference }




  heuresArriver = ["Vendredi soir (Repas + nuit)",
    "Vendredi soir (Nuit)",
    "Samedi matin",
    "Samedi soir (Repas + nuit)",
    "Samedi soir (Nuit)",
    "Dimanche matin",
    "Autre (préciser)"]

  heuresDepart = ["Samedi fin CR",
    "Dimanche fin CR",
    "Autre (préciser)"]

  participation = ["Si besoin",
    "Oui",
    "Non"]

  lit = ["Indifférent",
    "inférieur",
    "supérieur",
    "Pas de lit"]


    propDescription: FormControl = new FormControl<string>('', [])
    heureArriverControl: FormControl = new FormControl<string>('', [])
    heureDepartControl: FormControl = new FormControl<string>('', [])
    participationControl: FormControl = new FormControl<string>(this.participation[0], [])
    litControl: FormControl = new FormControl<string>(this.lit[0], [])

  form: FormGroup = this.builder.group({
    description: this.propDescription,
  })


  subscribe() {
    if (this.form.invalid) return
  }

}
