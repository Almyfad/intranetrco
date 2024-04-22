import { Component, Input } from '@angular/core';
import { Inscription } from '../../core/models/models';
import { NgFor,DatePipe } from '@angular/common';

@Component({
  selector: 'app-mes-inscriptions',
  standalone: true,
  imports: [NgFor,DatePipe],
  templateUrl: './mes-inscriptions.component.html',
  styleUrl: './mes-inscriptions.component.less'
})
export class MesInscriptionsComponent {
  @Input() inscriptions: Inscription[] | null= null;
}
