import { Component, inject } from '@angular/core';
import { RegistreService } from 'src/app/core/helios-api-client/api/api';
import { MembreFiltre } from 'src/app/core/helios-api-client/model/models';
import { ElevesDataTableComponent } from "../../eleves-datatable/eleves-datatable.component";

@Component({
  selector: 'app-parvis',
  imports: [ElevesDataTableComponent],
  templateUrl: './parvis.component.html',
  styleUrl: './parvis.component.scss'
})
export class ParvisComponent {
  readonly rs = inject(RegistreService);
  readonly fetchEleves = (page?: number, size?: number, filtre?: MembreFiltre) => this.rs.apiRegistreMembresParvisSearchPost(page, size, filtre);
}
