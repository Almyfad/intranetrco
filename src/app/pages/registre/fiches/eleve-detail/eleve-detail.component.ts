import { Component, inject, computed } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { StatutMembreComponent } from '../../statut-membre/statut-membre.component';
import { SidenavService } from 'src/app/services/sidenav.service';
import { EleveDetailService } from '../../services/eleve-detail.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { RouterModule } from '@angular/router';
import { MembreDTO } from 'src/app/core/helios-api-client';
import { MatButtonModule } from '@angular/material/button';
import { EleveFormComponent } from '../../form/eleve-form/eleve-form.component';

@Component({
  selector: 'app-eleve-detail',
  imports: [MaterialModule, CommonModule, NgScrollbarModule, StatutMembreComponent, TablerIconsModule, RouterModule, MatButtonModule],
  templateUrl: './eleve-detail.component.html',
  styleUrl: './eleve-detail.component.scss'
})
export class EleveDetailComponent {
  editEleve() {
    this.sidenavService
    .close()
    .setTitle('Edition de ' + this.currentEleve()?.prenom + ' ' + this.currentEleve()?.nom)
      .setComponent(EleveFormComponent)
    .open(500);

}

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

  // Signal computed pour calculer l'âge à partir de la date de naissance
  readonly age = computed(() => {
    const eleve = this.currentEleve();
    if (!eleve?.dateNaissance) return 0;

    const birthDate = new Date(eleve.dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  });

  closeSidenav(): void {
    this.sidenavService.close();
    // Optionnel : nettoyer les données quand on ferme
    this.eleveDetailService.clearEleve();
  }
}
