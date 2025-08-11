import { Component, inject, OnInit } from '@angular/core';
import { MembreDTO, RegistreService } from 'src/app/core/helios-api-client';
import { MatTableDataSource } from '@angular/material/table';


import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { StatutMembreComponent } from '../../statut-membre/statut-membre.component';

@Component({
  selector: 'app-eleves',
  imports: [CommonModule, MatTableModule, MatProgressBarModule, StatutMembreComponent],
  templateUrl: './eleves.component.html',
  styleUrl: './eleves.component.scss'
})
export class ElevesComponent implements OnInit {
  private readonly rs = inject(RegistreService);

  displayedColumns: string[] = ['statut', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'pays'];
  dataSource = new MatTableDataSource<MembreDTO>([]);
  loading = false;

  ngOnInit(): void {
    this.fetchEleves();
  }

  fetchEleves(): void {
    this.loading = true;
    this.rs.apiRegistreMembresPost(1, 50, undefined, 'body').subscribe({
      next: (result) => {
        this.dataSource.data = result.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
