import { Component, inject, computed } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { StatutMembreComponent } from '../../statut-membre/statut-membre.component';
import { SidenavService } from 'src/app/services/sidenav.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { RouterModule } from '@angular/router';
import { MembreDTO, RegistreService } from 'src/app/core/helios-api-client';
import { MatButtonModule } from '@angular/material/button';
import { EleveFormComponent } from '../../form/eleve-form/eleve-form.component';
import { RegistreModuleService } from '../../services/registre-module.service';
import { EleveTimelineComponent } from "src/app/components/eleve-timeline/eleve-timeline.component";

@Component({
  selector: 'app-eleve-detail',
  imports: [MaterialModule, CommonModule, NgScrollbarModule, StatutMembreComponent, TablerIconsModule, RouterModule, MatButtonModule, EleveTimelineComponent],
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
  readonly rs = inject(RegistreModuleService);

  openEleveDetail(m: MembreDTO) {
    this.rs.setEleve(m);
  }

  // Accès direct aux signaux du service
  readonly eleve = this.rs.eleve;
  readonly parents = this.rs.parents;
  readonly enfants = this.rs.enfants;
  readonly loading = this.rs.familyloading;
  readonly timeline = this.rs.timeline;

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
    this.rs.clearEleve();
  }
}
