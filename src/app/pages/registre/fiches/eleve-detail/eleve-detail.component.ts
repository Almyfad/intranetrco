import { Component, Input, OnInit, inject } from '@angular/core';
import { MembreDTO } from 'src/app/core/helios-api-client';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { StatutMembreComponent } from '../../statut-membre/statut-membre.component';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-eleve-detail',
  imports: [MaterialModule, CommonModule, NgScrollbarModule, StatutMembreComponent],
  templateUrl: './eleve-detail.component.html',
  styleUrl: './eleve-detail.component.scss'
})
export class EleveDetailComponent implements OnInit {
  @Input() eleve?: MembreDTO;
  private readonly sidenavService = inject(SidenavService);

  ngOnInit(): void {
    // Si l'élève n'est pas fourni, on peut logger ou gérer l'erreur
    if (!this.eleve) {
      console.warn('Aucune donnée d\'élève fournie au composant EleveDetailComponent');
    }
  }

  /**
   * Ferme la sidenav
   */
  closeSidenav(): void {
    this.sidenavService.close();
  }
}
