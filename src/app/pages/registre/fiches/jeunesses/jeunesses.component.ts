import { Component, inject } from '@angular/core';
import { ElevesDataTableComponent } from "../../eleves-datatable/eleves-datatable.component";
import { MembreFiltre, RegistreService } from 'src/app/core/helios-api-client';

@Component({
  selector: 'app-jeunesses',
  imports: [ElevesDataTableComponent],
  templateUrl: './jeunesses.component.html',
  styleUrl: './jeunesses.component.scss'
})
export class JeunessesComponent {
  readonly rs = inject(RegistreService);
  fetchEleves = (page?: number, size?: number, filtre?: MembreFiltre) => this.rs.apiRegistreMembresJeunesseSearchPost(page, size, filtre);

}
