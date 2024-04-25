import { Component, Input, OnInit, inject } from '@angular/core';
import { Inscription } from '../../core/models/models';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { AsyncValue } from '../../core/class/asyncvalue';
import { ConferenceExpansionPanelComponent } from '../conference-expansion-panel/conference-expansion-panel.component';

@Component({
  selector: 'app-mes-inscriptions',
  standalone: true,
  imports: [NgFor, ConferenceExpansionPanelComponent, AsyncPipe,NgIf,MatAccordion],
  templateUrl: './mes-inscriptions.component.html',
  styleUrl: './mes-inscriptions.component.less'
})
export class MesInscriptionsComponent implements OnInit {
  @Input() Oinscriptions!: Observable<Inscription[]>;
  mesinscriptions!: Observable<AsyncValue<Inscription>[]>;

  ngOnInit(): void {
    this.mesinscriptions = AsyncValue.of<Inscription>(this.Oinscriptions, 3)
  }

}
