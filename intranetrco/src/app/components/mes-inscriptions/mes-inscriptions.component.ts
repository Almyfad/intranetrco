import { Component, Input, OnInit, inject } from '@angular/core';
import { Inscription } from '../../core/models/models';
import { NgFor, DatePipe, AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { Observable, concat, } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AsyncValue } from '../../core/class/asyncvalue';
import { ConferencesService } from '../../core/services/conferences.service';

@Component({
  selector: 'app-mes-inscriptions',
  standalone: true,
  imports: [NgFor, DatePipe, MatExpansionModule, MatIcon, AsyncPipe, NgxSkeletonLoaderModule,NgIf],
  templateUrl: './mes-inscriptions.component.html',
  styleUrl: './mes-inscriptions.component.less'
})
export class MesInscriptionsComponent implements OnInit {
  @Input() inscriptions!: Observable<Inscription[]>;
  mesinscriptions!: Observable<AsyncValue<Inscription>[]>;

  ngOnInit(): void {
    this.mesinscriptions = AsyncValue.of<Inscription>(this.inscriptions, 3)
  }

}
