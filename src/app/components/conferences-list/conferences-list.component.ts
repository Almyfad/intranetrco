import { Component, Input, OnInit, inject, input } from '@angular/core';
import { Conference } from '../../core/models/models';
import { ConferencesCardComponent } from '../conferences-card/conferences-card.component';
import { Observable } from 'rxjs';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { AsyncPipe } from '@angular/common';
import { CurrentMode, InscriptionConferenceService } from '../../core/services/inscription-conference.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-conferences-list',
  standalone: true,
  imports: [AsyncPipe, ConferencesCardComponent,MatIcon],
  templateUrl: './conferences-list.component.html',
  styleUrl: './conferences-list.component.less'
})
export class ConferencesListComponent implements OnInit {
  @Input() conferences!: Observable<Conference[]>;
  private readonly insservice = inject(InscriptionConferenceService);

  SklConferences!: Observable<SkeletonValue<Conference>[]>;
  ngOnInit() {
    this.SklConferences = SkeletonValue
    .of<Conference>(this.conferences, this.insservice.mode === CurrentMode.editInscription ? 3 : 10);
  }
}
