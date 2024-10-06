import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Membre, UserService } from '../../core/osmose-api-client';
import { AsyncPipe } from '@angular/common';
import { map, shareReplay, tap } from 'rxjs';
import IChecboxKeyValue, { Dortoir, Taches } from './inscription-conference-stepper.class';
import { MatIconModule } from '@angular/material/icon';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-inscription-conference-stepper',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule, MatRadioModule, AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatIconModule,
    MatCheckboxModule,
    MatInputModule,],
  templateUrl: './inscription-conference-stepper.component.html',
  styleUrl: './inscription-conference-stepper.component.scss'
})
export class InscriptionConferenceStepperComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly user = inject(UserService);





  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required]
  });


  public familyFormGroup: FormGroup = this._formBuilder.group({
    participeCtrl: ['', Validators.required],
  });

  participationValues: IChecboxKeyValue<boolean>[] = [
    { value: true, displayValue: 'Je viens seul(e)' },
    { value: false, displayValue: 'je viens avec mes bouts de choux' }
  ];
  selectedParticipation: IChecboxKeyValue<boolean> | undefined;
  enfants: Membre[] = [];
  get avecEnfant() {
    return this.selectedParticipation?.value === false;
  }
  get EnfantSelected() {
    return this.enfants.filter(enfant => this.familyFormGroup.get(`${enfant.id}`)?.value === true);
  }

  mesEnfants$ = this.user.apiUserMesenfantsGet().pipe(shareReplay(1), tap(enfants => {
    this.enfants = enfants;
    enfants.forEach(enfant => {
      this.familyFormGroup.addControl(`${enfant.id}`, this._formBuilder.control(false));
    });
  }
  ));
  aucunEnfantRepertorie$ = this.mesEnfants$.pipe(map(enfants => enfants.length === 0));

  arriveeValues: IChecboxKeyValue<string>[] = [
    { value: 'Jeudi', displayValue: 'Jeudi' },
    { value: 'Vendredi', displayValue: 'Vendredi' },
    { value: 'Samedi', displayValue: 'Samedi' },
    { value: 'Dimanche', displayValue: 'Dimanche' }
  ];
  arriveeHeureValues: IChecboxKeyValue<string>[] = [
    { value: 'Matin', displayValue: 'Matin' },
    { value: 'Après-midi', displayValue: 'Après-midi' },
    { value: 'Soir', displayValue: 'Soir' }
  ];

  AriveeFormGroup = this._formBuilder.group({
    ArriveCtrl: [null, Validators.required],
    ArriveHeureCtrl: [null, Validators.required],
  });

  DepartFormGroup = this._formBuilder.group({
    DepartCtrl: [null, Validators.required],
    DepartHeureCtrl: [null, Validators.required],
  });

  selectedArrivee: IChecboxKeyValue<string> | undefined;
  selectedArriveeHeure: IChecboxKeyValue<string> | undefined;

  departValues: IChecboxKeyValue<string>[] = [
    { value: 'Jeudi', displayValue: 'Jeudi' },
    { value: 'Vendredi', displayValue: 'Vendredi' },
    { value: 'Samedi', displayValue: 'Samedi' },
    { value: 'Dimanche', displayValue: 'Dimanche' }
  ];

  departHeureValues: IChecboxKeyValue<string>[] = [
    { value: 'Matin', displayValue: 'Matin' },
    { value: 'Après-midi', displayValue: 'Après-midi' },
    { value: 'Soir', displayValue: 'Soir' }
  ];
  selectedDepart: IChecboxKeyValue<string> | undefined;
  selectedDepartHeure: IChecboxKeyValue<string> | undefined;



  tacheFormGroup = this._formBuilder.group({
    tachesCtrl: ['', Validators.required],
  });


  tachesValues: IChecboxKeyValue<Taches>[] = [
    { value: Taches.Partipe, displayValue: 'C\'est avec plaisir que je participe aux tâches' },
    { value: Taches.AuBesoin, displayValue: 'Au Besoin je participerai aux tâches' },
    { value: Taches.NeParticipePas, displayValue: 'Sans moi cette fois-ci svp' }
  ];
  selectedTaches: IChecboxKeyValue<Taches> | undefined;



  LitFormGroup = this._formBuilder.group({
    dortoirCtrl: ['', Validators.required],
  });

  dortoirValues: IChecboxKeyValue<Dortoir>[] = [
    { value: Dortoir.PeuImporte, displayValue: 'Je n\'ai aucune préference pour le lit' },
    { value: Dortoir.LitSuperieur, displayValue: 'Je préfere le lit du supérieur' },
    { value: Dortoir.LitInferieur, displayValue: 'Le lit inférieur siouplaît' },
    { value: Dortoir.PasdeLit, displayValue: 'Dormir ? sert à quoi ? pas besoin de lit !' }
  ];
  selectedDortoir: IChecboxKeyValue<string> | undefined;


  isLinear = true;
  currentTitle(stepper: MatStepper) {
    return [
      'Inscription',
      'Arrivée et départ',
      'Participations aux tâches',
      'Dortoir',
      'Confirmation de vos choix'

    ][stepper.selectedIndex];
  }


  get summary(): String[] {
    return [
      this.selectedParticipation?.value === true ? 'Je viens seul(e)' : "Je viens avec " + this.EnfantSelected.map(x => x.prenom).join(', '),
      this.selectedArrivee?.value != null ? `je viens le ${this.selectedArrivee.displayValue} ${(this.selectedArriveeHeure != null ? this.selectedArriveeHeure.displayValue : '')}` : null,
      this.selectedDepart?.value != null ? `je repars le ${this.selectedDepart.displayValue} ${(this.selectedDepartHeure != null ? this.selectedDepartHeure.displayValue : '')}` : null,
      this.selectedTaches?.value != null ? `${this.selectedTaches.displayValue}` : null,
      this.selectedDortoir?.value != null ? `${this.selectedDortoir.displayValue}` : null
    ].filter(x => x != null) as String[];
  }



  save() {
    const inscription = {
      arrivee: this.selectedArrivee?.value,
      arriveeHeure: this.selectedArriveeHeure?.value,
      depart: this.selectedDepart?.value,
      departHeure: this.selectedDepartHeure?.value,
      dortoir: this.selectedDortoir?.value,
      taches: this.selectedTaches?.value,
      enfants: this.EnfantSelected.map(x => x.id)
    }
    console.log(inscription);
  }

  goBack(stepper: MatStepper) {
    console.log("cliiicked");
    stepper.previous();
  }
  goForward(stepper: MatStepper) {
    stepper.next();
  }

}
