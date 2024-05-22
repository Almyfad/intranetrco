import { Component, Input, inject } from '@angular/core';
import { SkeletonValue } from '../../core/class/skeletonvalue';
import { Conference } from '../../core/models/models';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatCard } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { InscriptionConferenceService } from '../../core/services/inscription-conference.service';


@Component({
  selector: 'app-conferences-card',
  standalone: true,
  imports: [NgxSkeletonLoaderModule, MatCard, DatePipe, MatIcon],
  templateUrl: './conferences-card.component.html',
  styleUrl: './conferences-card.component.less'
})
export class ConferencesCardComponent {
  @Input() conference!: SkeletonValue<Conference>;
  private router: Router = inject(Router)
  private readonly insservice = inject(InscriptionConferenceService)

  editoradd() {
    this.insservice.conference = this.conference.value; 
    this.router.navigateByUrl('/conferences/inscription')
  }
}
