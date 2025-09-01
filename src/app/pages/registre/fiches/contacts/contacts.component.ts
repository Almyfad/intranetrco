import { Component, inject } from '@angular/core';
import { ElevesDataTableComponent } from "../../eleves-datatable/eleves-datatable.component";
import { MembreFiltre, RegistreService } from 'src/app/core/helios-api-client';


@Component({
  selector: 'app-contacts',
  imports: [ElevesDataTableComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  readonly rs = inject(RegistreService);
  fetchEleves = (page?: number, size?: number, filtre?: MembreFiltre) => this.rs.apiRegistreMembresContactsSearchPost(page, size, filtre);

}
