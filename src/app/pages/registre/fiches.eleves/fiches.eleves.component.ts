import { Component, inject } from '@angular/core';
import { AgGridAngular } from '@ag-grid-community/angular'; // Angular Data Grid Component
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AG_GRID_LOCALE_FR } from '@ag-grid-community/locale';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../../core/osmose-api-client/api/user.service';
import { RegistreService } from '../../../core/osmose-api-client/api/registre.service';
import { MenuService } from '../../../core/services/menu.service';
import { map, switchMap } from 'rxjs';
import { Centre } from '../../../core/osmose-api-client';


ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
  selector: 'app-fiches.eleves',
  standalone: true,
  imports: [AgGridAngular, AsyncPipe],
  templateUrl: './fiches.eleves.component.html',
  styleUrl: './fiches.eleves.component.scss'
})


export class FichesElevesComponent {
  private readonly UserService = inject(UserService)
  private readonly RegistreService = inject(RegistreService)
  private readonly menuService = inject(MenuService);
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 50, 100];

  gridOptions = {
    localeText: AG_GRID_LOCALE_FR,
  }
  get height() { return this.paginationPageSize * 42 + 3 * 49; }



  rowData$ = this.menuService.SelectedCenter.pipe(
    switchMap((centre) => {
      if (centre) {
        return this.RegistreService.apiRegistreMembresGet().pipe(map((membres) => {
          return membres.filter((m) => m.centre?.id === centre.id)
        }))
      }
      return this.RegistreService.apiRegistreMembresGet()
    })
  )


  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "nom", filter: true, floatingFilter: true, flex: 3 },
    { field: "prenom", filter: true, floatingFilter: true, flex: 3 },
    {
      field: "centre", filter: true, floatingFilter: true, flex: 1,
      cellRenderer: (params: { data: { centre: Centre }; }) => params.data.centre.libelle,

    },
    { field: "email", filter: true, floatingFilter: true, flex: 2 },
    { field: "aspect", filter: true, floatingFilter: true, flex: 1 },

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
