import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-inscription-conference-stepper',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './inscription-conference-stepper.component.html',
  styleUrl: './inscription-conference-stepper.component.scss'
})
export class InscriptionConferenceStepperComponent {
  private readonly _formBuilder = inject(FormBuilder);
  arriveeSelectionnee: string = ''; 
  departSelectionnee: string = '';
  

  firstFormGroup = this._formBuilder.group({
    ArriveCtrl: ['', Validators.required],
    DepartCtrl: ['', Validators.required],
    ArriveHeureCtrl: ['', Validators.required],
    DepartHeureCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = true;


  afficherArrivee() {
    const jour = this.firstFormGroup.get('ArriveCtrl')?.value;
    const heure = this.firstFormGroup.get('ArriveHeureCtrl')?.value;

    if (jour || heure) {
      this.arriveeSelectionnee = `${jour} ${heure}`;
    } else {
      this.arriveeSelectionnee = ''; 
    }
  }

  afficherDepart() {
    const jour = this.firstFormGroup.get('DepartCtrl')?.value;
    const heure = this.firstFormGroup.get('DepartHeureCtrl')?.value;

    if (jour || heure) {
      this.departSelectionnee = `${jour} ${heure}`;
    } else {
      this.departSelectionnee = ''; 
    }
  }

}
