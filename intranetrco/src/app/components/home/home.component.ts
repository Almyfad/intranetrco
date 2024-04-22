import { Component, inject } from '@angular/core';
import { MesInscriptionsComponent } from '../mes-inscriptions/mes-inscriptions.component';
import { InscriptionsComponent } from '../inscriptions/inscriptions.component';
import { InscriptionsService } from '../../core/services/inscriptions.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MesInscriptionsComponent,InscriptionsComponent,AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent  {

  private readonly inscription = inject(InscriptionsService);
  mesinscriptions = this.inscription.getMesInscriptions();

}
