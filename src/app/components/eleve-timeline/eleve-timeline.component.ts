import { Component, computed, inject, input, model, signal, Signal } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MembreDTO, RegistreService, TimelineMembreDTO, TimelineMembreType } from 'src/app/core/helios-api-client';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';

import { AsyncSelectComponent, SelectOption } from "../async-select/async-select.component";
import { RegistreModuleService } from 'src/app/pages/registre/services/registre-module.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { MatIconModule } from "@angular/material/icon";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SnackBarService } from 'src/app/layouts/full/shared/snack-bar/snack-bar.service';
@Component({
  selector: 'app-eleve-timeline',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    MatNativeDateModule,
    MatDatepickerModule,
    AsyncSelectComponent,
    TablerIconsModule,
    MatIconModule
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }],
  templateUrl: './eleve-timeline.component.html',
  styleUrl: './eleve-timeline.component.scss'
})
export class EleveTimelineComponent {
  readonly registre = inject(RegistreService)
  readonly rs = inject(RegistreModuleService);
  readonly snackBar = inject(SnackBarService);
  eleve = input.required<MembreDTO | null>();
  timeline = model.required<TimelineMembreDTO[] | null>();


  typeoptions = computed<SelectOption<TimelineMembreType>[]>(() => {
    const data = this.rs.timelineEventTypes().data;
    return data.map((item) => ({
      label: item.description ?? "Unknown",
      value: item
    }));
  });

  isloading = computed(() => this.rs.timelineEventTypes().loading);

  private _formBuilder = inject(FormBuilder);

  newEventForm = this._formBuilder.group({
    commentaire: [''],
    date: ['', Validators.required],
    type: ['', Validators.required],
  });

  timeline_controls = computed<TimelineControl[]>(() => {
    const timeline = this.timeline();
    if (!timeline) return [];
    return timeline.map((x: TimelineMembreDTO) => ({
      id: String(x.id),
      control: this._formBuilder.group({
        commentaire: [x.commentaire],
        date: [x.date, Validators.required],
        type: [x.type, Validators.required],
      }),
      timeline: x
    }));
  });

  toggleAdd() {
    this.displaynew = !this.displaynew;
  }
  displaynew: boolean = false;
  add() {
    if (this.newEventForm.invalid || !this.eleve()) return;
    var timeline = {
      id: 0,
      ...this.newEventForm.value
    } as TimelineMembreDTO
    this.registre.apiRegistreMembresIdTimelinePost(this.eleve()!.id, timeline).subscribe(
      {
        next: () => {
          this.snackBar.success('élément ajouté');
          this.rs.reloadAll();
          this.newEventForm.reset();
          this.displaynew = false;
        },
        error: (error) => {
          this.snackBar.error('Erreur lors de l\'ajout');
          console.error('Erreur lors de l\'ajout:', error);
        }
      }
    );
  }
  deleteEvent(t: TimelineControl) {
    if (!this.eleve()) return;

    this.registre.apiRegistreMembresIdTimelineTimelineIdDelete(this.eleve()!.id, t.timeline.id)
      .subscribe({
        next: () => {
          this.snackBar.success('élément supprimé');
          this.rs.reloadAll();
        },
        error: (error) => {
          this.snackBar.error('Erreur lors de la suppression');
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
  }
  updateEvent(t: TimelineControl) {
    if (t.control.invalid || !this.eleve()) return;
    this.registre.apiRegistreMembresIdTimelineTimelineIdPut(this.eleve()!.id, t.timeline.id, t.control.value).subscribe(
      {
        next: () => {
          this.snackBar.success('élément mis à jour');
          this.rs.reloadAll();
        },
        error: (error) => {
          this.snackBar.error('Erreur lors de la mise à jour');
          console.error('Erreur lors de la mise à jour:', error);
        }
      }
    );
  }

}

interface TimelineControl {
  id: string;
  control: FormGroup;
  timeline: TimelineMembreDTO;
}
