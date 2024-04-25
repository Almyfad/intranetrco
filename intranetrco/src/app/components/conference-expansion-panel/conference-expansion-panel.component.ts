import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Centre, Conference, Inscription } from '../../core/models/models';
import { DatePipe, NgIf } from '@angular/common';
import { SkeletonValue } from '../../core/class/skeletonvalue';

@Component({
  selector: 'conference-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule, NgxSkeletonLoaderModule, MatIcon, DatePipe, NgIf],
  templateUrl: './conference-expansion-panel.component.html',
  styleUrl: './conference-expansion-panel.component.less'
})
export class ConferenceExpansionPanelComponent {
  @Input() SklValue!: SkeletonValue<Conference | Inscription>;

  get isInscription(): boolean {
    let obj = this.SklValue.value;
    return obj !== null && typeof obj === 'object' && 'conference' in obj;
  }

  get isConference(): boolean {
    let obj = this.SklValue.value;
    return obj !== null && typeof obj === 'object' && 'centre' in obj;
  }

  get conference(): Conference {
    if (this.isConference) {
      return this.SklValue.value as Conference;
    } else {
      return (this.SklValue.value as Inscription).conference;
    }

  }


}
