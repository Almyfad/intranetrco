import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
/* Core Data Grid CSS */
import 'ag-grid-community/styles/ag-grid.css';
/* Quartz Theme Specific CSS */
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../../core/osmose-api-client';

@Component({
  selector: 'app-fiches.eleves',
  standalone: true,
  imports: [AgGridAngular,AsyncPipe],
  templateUrl: './fiches.eleves.component.html',
  styleUrl: './fiches.eleves.component.scss'
})
export class FichesElevesComponent {
  private readonly UserService = inject(UserService)
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 1000];

  rowData$ = this.UserService.apiUserGet();

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "nom", filter: true, floatingFilter: true, flex: 1 },
    { field: "prenom", filter: true, floatingFilter: true, flex: 1 },
    { field: "email", filter: true, floatingFilter: true, flex: 1 },
    { field: "creation", filter: true, floatingFilter: true, flex: 1 }
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
