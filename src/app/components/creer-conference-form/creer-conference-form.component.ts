import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConferenceService, RegisterConferenceRequest, TypeActivitee, TypeMembre, TypesActivitees } from '../../core/osmose-api-client';
import { MenuService } from '../../core/services/menu.service';
import { AutocompleteChipsComponent } from '../autocomplete-chips/autocomplete-chips.component';
import { AsyncPipe } from '@angular/common';
import { SnackbarService } from '../../core/services/snackbar.service';


@Component({
  selector: 'app-creer-conference-form',
  standalone: true,
  imports: [
    MatInputModule, MatDatepickerModule, AsyncPipe,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    AutocompleteChipsComponent,
  ],
  templateUrl: './creer-conference-form.component.html',
  styleUrl: './creer-conference-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class CreerConferenceFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private readonly conferenceService = inject(ConferenceService);
  private readonly menuService = inject(MenuService);
  private readonly snackBar = inject(SnackbarService);

  form = this.fb.group({
    centre: [null as string | null],
    typeconference: [null as TypeActivitee | null, Validators.required],
    aspect: [null as TypeMembre[] | null, Validators.required],
    libelle: [null as string | null, Validators.required],
    dateDebut: [null as Date | null, Validators.required],
    dateFin: [null as Date | null, Validators.required],
    description: [null as string | null]
  });




  onTypeActiviteeChange($event: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.menuService.selectedCentre$.subscribe((centre) => {
      if (centre) {
        this.form.get('centre')!.setValue(centre.libelle);
      }
    });
  }

  typeActivitees = this.conferenceService.apiConferenceConferenceTypesGet();
  aspects = this.conferenceService.apiConferenceConferenceAspectGet();


  onSubmit(): void {
    if (!this.form.valid) return;

    var request: RegisterConferenceRequest = {
      libelle: this.form.get('libelle')!.getRawValue(),
      dateDebut: this.form.get('dateDebut')!.getRawValue(),
      dateFin: this.form.get('dateFin')!.getRawValue(),
      description: this.form.get('description')?.getRawValue(),
      centreId: this.menuService.selectedCenter.id!,
      codeTypeActivitee: this.form.get('typeconference')!.getRawValue().code!,
      typeMembres: this.form.get('aspect')!.getRawValue()!.map((a: any) => a!.code!),

    };



    this.conferenceService.apiConferenceConferencePost(request).subscribe({
      next: _ => {
        this.snackBar.success(`Conférence sauvegardée avec succès`);
        this.form.reset({}, { emitEvent: false });

      }, error: err => {
        this.snackBar.error(err.message)
      }
    });
  }
}


