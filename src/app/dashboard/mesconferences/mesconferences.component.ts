import { Component, inject } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConferenceInfo } from '../../core/osmose-api-client';
import { InscriptionConferenceFormComponent } from '../../components/inscription-conference-form/inscription-conference-form.component';
import { InscriptionConferenceStepperComponent } from '../../components/inscription-conference-stepper/inscription-conference-stepper.component';

@Component({
  selector: 'app-mesconferences',
  standalone: true,
  imports: [AsyncPipe,MatListModule,DatePipe,MatButtonModule,MatIconModule,MatGridListModule],
  templateUrl: './mesconferences.component.html',
  styleUrl: './mesconferences.component.scss'
})
export class MesconferencesComponent {

  private readonly daschboardService = inject(DashboardService);
  private readonly dialog = inject(MatDialog);

  mesconferences = this.daschboardService.mesconferences()


  subscribe(conf: ConferenceInfo) {
    const dialogRef = this.dialog.open(InscriptionConferenceStepperComponent, {
      width: '600px',   
      data: conf
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    }


}
