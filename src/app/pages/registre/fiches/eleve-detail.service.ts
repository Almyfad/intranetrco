import { Injectable, signal, computed, effect } from '@angular/core';
import { MembreDTO, FamilyDTO } from 'src/app/core/helios-api-client/model/models';
import { RegistreService } from 'src/app/core/helios-api-client/api/api';

@Injectable({
  providedIn: 'root'
})
export class EleveDetailService {

  constructor(private registreService: RegistreService) { 
    // Effet pour récupérer automatiquement les données de famille
    effect(() => {
      const eleve = this.selectedEleve();
      if (eleve?.id) {
        this.loadFamilyData(eleve.id);
      }
    });
  }

  // Signaux privés
  private selectedEleve = signal<MembreDTO | null>(null);
  private familyData = signal<FamilyDTO | null>(null);
  private isLoading = signal<boolean>(false);

  // Signaux publics en lecture seule
  readonly eleve = this.selectedEleve.asReadonly();
  readonly family = this.familyData.asReadonly();
  readonly loading = this.isLoading.asReadonly();

  // Signaux calculés pour parents et enfants
  readonly parents = computed(() => {
    return this.familyData()?.parents || [];
  });

  readonly enfants = computed(() => {
    return this.familyData()?.enfants || [];
  });

  // Méthodes publiques
  setEleve(eleve: MembreDTO): void {
    if (!eleve.id) {
      console.warn('Tentative de sélection d\'un élève sans ID:', eleve);
      return;
    }
    this.selectedEleve.set(eleve);
  }

  clearEleve(): void {
    this.selectedEleve.set(null);
    this.familyData.set(null);
  }

  // Méthode privée pour charger les données de famille
  private async loadFamilyData(eleveId: number): Promise<void> {
    try {
      this.isLoading.set(true);
      
      const familyResponse = await this.registreService.apiRegistreMembresFamilyIdGet(eleveId).toPromise();
      
      if (familyResponse) {
        this.familyData.set(familyResponse);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de famille:', error);
      this.familyData.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }
}
