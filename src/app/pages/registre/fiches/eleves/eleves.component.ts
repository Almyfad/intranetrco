import { Component, inject, OnInit } from '@angular/core';
import { MembreDTO, RegistreService, DataPagerOfMembreDTO } from 'src/app/core/helios-api-client';
import { MatTableDataSource } from '@angular/material/table';
import { SidenavService } from 'src/app/services/sidenav.service';
import { EleveDetailComponent } from '../eleve-detail/eleve-detail.component';

import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { StatutMembreComponent } from '../../statut-membre/statut-membre.component';

@Component({
  selector: 'app-eleves',
  imports: [CommonModule, MatTableModule, MatProgressBarModule, MatPaginatorModule, MaterialModule, StatutMembreComponent],
  templateUrl: './eleves.component.html',
  styleUrl: './eleves.component.scss'
})
export class ElevesComponent implements OnInit {
  private readonly rs = inject(RegistreService);
  private readonly sidenavService = inject(SidenavService);

  displayedColumns: string[] = ['statut', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'pays'];
  dataSource = new MatTableDataSource<MembreDTO>([]);
  loading = false;

  // Propriétés de pagination
  totalElements = 0;
  pageSize = 50;
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.fetchEleves();
  }

  fetchEleves(): void {
    this.loading = true;
    // Page +1 car l'API semble utiliser une indexation basée sur 1
    this.rs.apiRegistreMembresPost(this.currentPage + 1, this.pageSize, undefined, 'body').subscribe({
      next: (result: DataPagerOfMembreDTO) => {
        this.dataSource.data = result.data || [];
        this.totalElements = result.total || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  /**
   * Gère les changements de pagination
   * @param event - Événement de pagination Material
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchEleves();
  }

  /**
   * Ouvre la sidenav avec le détail de l'élève sélectionné
   * @param eleve - L'élève dont on veut afficher le détail
   */
  openEleveDetail(eleve: MembreDTO): void {
    this.sidenavService
      .setComponent(EleveDetailComponent, { eleve: eleve })
      .setTitle('🧾 Détail de l\'élève id: ' + eleve.id)
      .setWidth('600px')
      .open();
  }
}
