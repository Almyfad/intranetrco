import { Component, inject, computed } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { StatutMembreComponent } from '../../statut-membre/statut-membre.component';
import { SidenavService } from 'src/app/services/sidenav.service';
import { EleveDetailService } from '../eleve-detail.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { RouterModule } from '@angular/router';
import { MembreDTO } from 'src/app/core/helios-api-client';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-eleve-detail',
  imports: [MaterialModule, CommonModule, NgScrollbarModule, StatutMembreComponent, TablerIconsModule, RouterModule, MatButtonModule],
  templateUrl: './eleve-detail.component.html',
  styleUrl: './eleve-detail.component.scss'
})
export class EleveDetailComponent {

  private readonly sidenavService = inject(SidenavService);
  
  // Injection du service - tout est géré par le service maintenant !
  readonly eleveDetailService = inject(EleveDetailService);

  openEleveDetail(m: MembreDTO) {
    this.eleveDetailService.setEleve(m);
  }

  // Accès direct aux signaux du service
  readonly eleve = this.eleveDetailService.eleve;
  readonly parents = this.eleveDetailService.parents;
  readonly enfants = this.eleveDetailService.enfants;
  readonly loading = this.eleveDetailService.loading;

  // Signal pour éviter les erreurs de type null
  readonly currentEleve = computed(() => this.eleve());

  closeSidenav(): void {
    this.sidenavService.close();
    // Optionnel : nettoyer les données quand on ferme
    this.eleveDetailService.clearEleve();
  }
}
