import { Component, Input } from '@angular/core';
import { MembreOutput } from '../../core/osmose-api-client';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DetailEleveDetailComponent } from "../detail-eleve-detail/detail-eleve-detail.component";
import { DetailEleveEditComponent } from "../detail-eleve-edit/detail-eleve-edit.component";
import { animate,  style, transition, trigger } from '@angular/animations';

enum Mode { detail, edit }
export type ExpansionColor = 'parents' | 'enfants' | undefined;

@Component({
  selector: 'app-detail-eleve',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatExpansionModule, MatIconModule, DetailEleveDetailComponent, DetailEleveEditComponent],
  animations: [
    trigger('toogleView', [
      transition(':enter', [
        style({
          opacity: 0,
          height: '0px',
          transform: 'translateX(100%)',
        }),
        animate('500ms', style(
          {
            opacity: 1,
            height: '*',
            transform: 'translateX(0)'
          }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          height: '*',
          transform: 'translateX(0)',
        }),
        animate('500ms', style(
          {
            opacity: 0,
            height: '0px',
            transform: 'translateX(-100%)'
          }))
      ]),
    ],
    )],
  templateUrl: './detail-eleve.component.html',
  styleUrl: './detail-eleve.component.scss'
})
export class DetailEleveComponent {



  @Input() eleve!: MembreOutput;
  @Input() color: ExpansionColor = undefined;
  mode: Mode = Mode.detail;


  get isDetailMode() {
    return this.mode === Mode.detail;
  }
  get isEditMode() {
    return this.mode === Mode.edit;
  }

  get toogleLabel() {
    return this.mode === Mode.detail ? 'Editer' : 'Annuler';
  }

  swithView() {
    this.mode = this.mode === Mode.detail ? Mode.edit : Mode.detail;
  }
}