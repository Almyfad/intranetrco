import { Component, inject } from '@angular/core';
import { ElevesDataTableComponent } from "../../eleves-datatable/eleves-datatable.component";
import { MembreFiltre, RegistreService } from 'src/app/core/helios-api-client';

@Component({
  selector: 'app-jeunes-rosicruciens',
  imports: [ElevesDataTableComponent],
  templateUrl: './jeunes-rosicruciens.component.html',
  styleUrl: './jeunes-rosicruciens.component.scss'
})
export class JeunesRosicruciensComponent {
  readonly rs = inject(RegistreService);
  fetchEleves = (page?: number, size?: number, filtre?: MembreFiltre) => this.rs.apiRegistreMembresJeunesRosicruciensSearchPost(page, size, filtre);

}
