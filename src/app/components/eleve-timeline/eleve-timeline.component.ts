import { Component, computed, inject, input, model, signal, Signal } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MembreDTO, TimelineMembreDTO, TimelineMembreType } from 'src/app/core/helios-api-client';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';

import { AsyncSelectComponent, SelectOption } from "../async-select/async-select.component";
import { RegistreModuleService } from 'src/app/pages/registre/services/registre-module.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { MatIconModule } from "@angular/material/icon";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
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
  toggleAdd() {
    this.displaynew = !this.displaynew;
  }
  displaynew: boolean = false;
  add() {
    throw new Error('Method not implemented.');
  }
  deleteEvent(t: TimelineControl) {
    throw new Error('Method not implemented.');
  }
  updateEvent(t: TimelineControl) {
    console.log(t.control.value.type);
  }
  readonly rs = inject(RegistreModuleService);
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
    commentaire: ['', Validators.required],
    date: ['', Validators.required],
    type: ['', Validators.required],
  });

  timeline_controls = computed<TimelineControl[]>(() => {
    const timeline = this.timeline();
    if (!timeline) return [];
    return timeline.map((x: TimelineMembreDTO) => ({
      id: String(x.id),
      control: this._formBuilder.group({
        commentaire: [x.commentaire, Validators.required],
        date: [x.date, Validators.required],
        type: [x.type, Validators.required],
      }),
      timeline: x
    }));
  });

}

interface TimelineControl {
  id: string;
  control: FormGroup;
  timeline: TimelineMembreDTO;
}

