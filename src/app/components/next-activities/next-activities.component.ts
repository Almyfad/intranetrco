import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { Conference } from '../../core/models/models';
import { Observable } from 'rxjs';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-next-activities',
  standalone: true,
  imports: [MatCard, MatCardContent, MatList, MatListItem, DatePipe, AsyncPipe, NgxSkeletonLoaderModule],
  templateUrl: './next-activities.component.html',
  styleUrl: './next-activities.component.less'
})
export class NextActivitiesComponent implements OnInit {

  @Input() Oconferences!: Observable<Conference[]>;
  @Input() titre: string = 'Next Activities';


  conferences!: Observable<SkeletonValue<Conference>[]>


  ngOnInit(): void {
    this.conferences = SkeletonValue.of(this.Oconferences, 3);
  }
}
