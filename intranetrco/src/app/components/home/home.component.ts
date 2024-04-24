import { Component, inject } from '@angular/core';
import { MesInscriptionsComponent } from '../mes-inscriptions/mes-inscriptions.component';
import { InscriptionsComponent } from '../inscriptions/inscriptions.component';
import { ConferencesService } from '../../core/services/conferences.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MesInscriptionsComponent,InscriptionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent  {
  private readonly confAPI = inject(ConferencesService);
  mesinscriptions = this.confAPI.getMesInscriptions();
  conferences = this.confAPI.getConferences();
  types = this.confAPI.getTypes();
  centres = this.confAPI.getCentres();

}
