import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Conference } from '../../core/models/models';
import { AsyncValue } from '../../core/class/asyncvalue';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-inscriptions',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, MatIcon, NgxSkeletonLoaderModule, AsyncPipe,MatExpansionModule],
  templateUrl: './inscriptions.component.html',
  styleUrl: './inscriptions.component.less'
})
export class InscriptionsComponent implements OnInit {
  @Input() Oconferences!: Observable<Conference[]>;
  conferences!: Observable<AsyncValue<Conference>[]>;

  ngOnInit(): void {
    this.conferences = AsyncValue.of<Conference>(this.Oconferences, 10)
  }
}
