import { Component, inject } from '@angular/core';
import { AgGridAngular } from '@ag-grid-community/angular'; // Angular Data Grid Component
import { ColDef ,ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AG_GRID_LOCALE_FR } from '@ag-grid-community/locale';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../../core/osmose-api-client/api/user.service';
import { RegistreService } from '../../../core/osmose-api-client/api/registre.service';


ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
  selector: 'app-fiches.eleves',
  standalone: true,
  imports: [AgGridAngular,AsyncPipe],
  templateUrl: './fiches.eleves.component.html',
  styleUrl: './fiches.eleves.component.scss'
})


export class FichesElevesComponent {
  private readonly UserService = inject(UserService)
  private readonly RegistreService = inject(RegistreService)
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 1000];
  gridOptions = {
    localeText: AG_GRID_LOCALE_FR,
  }

  rowData$ =this.RegistreService.apiRegistreMembresGet()

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "nom", filter: true, floatingFilter: true, flex: 3 },
    { field: "prenom", filter: true, floatingFilter: true, flex: 3 },
    { field: "centres", filter: true, floatingFilter: true, flex: 1 },
    { field: "email", filter: true, floatingFilter: true, flex: 2 },
    { field: "aspect", filter: true, floatingFilter: true, flex: 1 }
  ];




    /*    id?: number;
    modification?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    pays?: string | null;
    roles?: Array<Role> | null;*/
}
