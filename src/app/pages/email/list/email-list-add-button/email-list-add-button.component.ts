import { animate, style, transition, trigger } from '@angular/animations';
import { O } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-email-list-add-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ transform: 'scaleX(0)', width: 0, opacity: 0 }),
            animate('500ms ease-out',
              style({ transform: 'scaleX(1)', width: '*', opacity: 1, }))
          ]
        ),
        transition(
          ':leave',
          [
            animate('500ms ease-in',
              style({ transform: 'scaleX(0)', width: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ],
  templateUrl: './email-list-add-button.component.html',
  styleUrl: './email-list-add-button.component.scss'
})
export class EmailListAddButtonComponent {
  _cancel() {
    this.addingmode = false;

  }
  _save() {
    this.addingmode = false;
    this.save.emit();
  }
  _add() {
    this.addingmode = true;
  }
  @Input() label: string = 'Ajouter';
  @Input() icon: string = 'add';
  @Input() contentWidth: number | undefined;
  @Output() save = new EventEmitter<void>();

  addingmode = false;

}

