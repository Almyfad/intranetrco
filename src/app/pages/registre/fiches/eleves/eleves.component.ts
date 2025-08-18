import { Component, inject, OnInit, OnDestroy, computed, Signal } from '@angular/core';
import { MembreDTO, RegistreService, DataPagerOfMembreDTO, MembreFiltre, CentreDTO, TypeMembreDTO, StatutMembreDTO, NullableOfStatutsMembres } from 'src/app/core/helios-api-client';
import { MatTableDataSource } from '@angular/material/table';
import { SidenavService } from 'src/app/services/sidenav.service';
import { EleveDetailComponent } from '../eleve-detail/eleve-detail.component';
import { Router, ActivatedRoute } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { StatutMembreComponent,getStatusColor,getStatusIcon } from '../../statut-membre/statut-membre.component';
import { AsyncSelectComponent, AsyncSelectOption } from 'src/app/components/async-select/async-select.component';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, map, BehaviorSubject, Observable } from 'rxjs';
import { EleveDetailService } from '../../services/eleve-detail.service';
import { RegistreModuleService } from '../../services/registre-module.service';

@Component({
  selector: 'app-eleves',
  imports: [
    CommonModule, 
    MatTableModule, 
    MatProgressBarModule, 
    MatPaginatorModule, 
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MaterialModule, 
    StatutMembreComponent,
    AsyncSelectComponent
  ],
  templateUrl: './eleves.component.html',
  styleUrl: './eleves.component.scss'
})
export class ElevesComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rs = inject(RegistreService);
  private readonly sidenavService = inject(SidenavService);
  private readonly eleveDetailService = inject(EleveDetailService);
  private readonly registre = inject(RegistreModuleService);
  private readonly destroy$ = new Subject<void>();

  displayedColumns: string[] = ['statut', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'pays'];
  dataSource = new MatTableDataSource<MembreDTO>([]);
  loading = false;

  // Propriétés de pagination
  totalElements = 0;
  pageSize = 50;
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100];

  // Contrôles de filtrage
  nomFilterControl = new FormControl('');
  prenomFilterControl = new FormControl('');
  emailFilterControl = new FormControl('');
  villeFilterControl = new FormControl('');
  paysFilterControl = new FormControl('');
  
  // Propriétés pour le filtre centre
  centresLoading = computed(() => this.registre.centres().loading);
  centresOptions = computed(() => {
    const centres = this.registre.centres();
    return centres.data.map(centre => ({
      value: centre.libelle,
      label: centre.libelle || 'Centre sans nom'
    }));
  });
  selectedCentres: string[] = [];

  // Propriétés pour le filtre aspects (types membres)
  aspectsLoading = computed(() => this.registre.aspects().loading);
  aspectsOptions: Signal<AsyncSelectOption<TypeMembreDTO>[]> = computed(() => {
    const aspects = this.registre.aspects();
    return aspects.data.map(aspect => ({
      value: aspect,
      label: aspect.libelle || 'Type membre sans nom'
    }));
  });
  selectedAspects: number[] = [];

  // Propriétés pour le filtre statuts
  statutsLoading = computed(() => this.registre.statuts().loading);
  statutsOptions = computed(() => {
    const statuts = this.registre.statuts();
    return statuts.data.map(statut => ({
      value: statut.id || 0,
      label: statut.libelle || 'Statut sans nom',
      icon: getStatusIcon(statut.code as NullableOfStatutsMembres),
      iconColor: getStatusColor(statut.code as NullableOfStatutsMembres)
    }));
  });
  selectedStatuts: number[] = [];

  // Propriété pour le collapse des filtres
  filtersExpanded = false;

  constructor() {
    // Plus besoin de charger manuellement car nous utilisons les signaux
  }

  ngOnInit(): void {
    this.fetchEleves();
    this.setupFilters();
    
    // Écouter les changements de paramètres d'URL pour détecter l'ID
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const eleveId = params['id'];
      if (eleveId) {
        this.openEleveDetailById(Number(eleveId));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupFilters(): void {
    // Configuration du debounce pour le filtre nom
    this.nomFilterControl.valueChanges
      .pipe(
        debounceTime(300), // Attendre 300ms après la dernière frappe
        distinctUntilChanged(), // Ne déclencher que si la valeur a changé
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        // Ne déclencher la recherche qu'à partir de 3 caractères ou si le champ est vide
        if (!value || value.trim().length === 0 || value.trim().length >= 3) {
          this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
          this.fetchEleves();
        }
      });

    // Configuration du debounce pour le filtre prénom
    this.prenomFilterControl.valueChanges
      .pipe(
        debounceTime(300), // Attendre 300ms après la dernière frappe
        distinctUntilChanged(), // Ne déclencher que si la valeur a changé
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        // Ne déclencher la recherche qu'à partir de 3 caractères ou si le champ est vide
        if (!value || value.trim().length === 0 || value.trim().length >= 3) {
          this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
          this.fetchEleves();
        }
      });

    // Configuration du debounce pour le filtre email
    this.emailFilterControl.valueChanges
      .pipe(
        debounceTime(300), // Attendre 300ms après la dernière frappe
        distinctUntilChanged(), // Ne déclencher que si la valeur a changé
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        // Ne déclencher la recherche qu'à partir de 3 caractères ou si le champ est vide
        if (!value || value.trim().length === 0 || value.trim().length >= 3) {
          this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
          this.fetchEleves();
        }
      });

    // Configuration du debounce pour le filtre ville
    this.villeFilterControl.valueChanges
      .pipe(
        debounceTime(300), // Attendre 300ms après la dernière frappe
        distinctUntilChanged(), // Ne déclencher que si la valeur a changé
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        // Ne déclencher la recherche qu'à partir de 3 caractères ou si le champ est vide
        if (!value || value.trim().length === 0 || value.trim().length >= 3) {
          this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
          this.fetchEleves();
        }
      });

    // Configuration du debounce pour le filtre pays
    this.paysFilterControl.valueChanges
      .pipe(
        debounceTime(300), // Attendre 300ms après la dernière frappe
        distinctUntilChanged(), // Ne déclencher que si la valeur a changé
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        // Ne déclencher la recherche qu'à partir de 3 caractères ou si le champ est vide
        if (!value || value.trim().length === 0 || value.trim().length >= 3) {
          this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
          this.fetchEleves();
        }
      });
  }

  fetchEleves(): void {
    this.loading = true;
    
    // Construction du filtre
    const filter: MembreFiltre = {};
    const nomValue = this.nomFilterControl.value?.trim();
    const prenomValue = this.prenomFilterControl.value?.trim();
    const emailValue = this.emailFilterControl.value?.trim();
    const villeValue = this.villeFilterControl.value?.trim();
    const paysValue = this.paysFilterControl.value?.trim();
    
    if (nomValue) {
      filter.nom = nomValue;
    }
    if (prenomValue) {
      filter.prenom = prenomValue;
    }
    if (emailValue) {
      filter.email = emailValue;
    }
    if (villeValue) {
      filter.ville = villeValue;
    }
    if (paysValue) {
      filter.pays = paysValue;
    }
    if (this.selectedCentres && this.selectedCentres.length > 0) {
      filter.l_centres = this.selectedCentres;
    }
    if (this.selectedAspects && this.selectedAspects.length > 0) {
      filter.l_aspects = this.selectedAspects;
    }
    if (this.selectedStatuts && this.selectedStatuts.length > 0) {
      filter.l_statuts = this.selectedStatuts;
    }

    // Page +1 car l'API semble utiliser une indexation basée sur 1
    this.rs.apiRegistreMembresPost(this.currentPage + 1, this.pageSize, filter, 'body')
    .subscribe({
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
   * Gère la sélection de centres (multiselect)
   * @param selectedCentres - Tableau des centres sélectionnés
   */
  onCentreSelection(selectedCentres: any): void {
    this.selectedCentres = Array.isArray(selectedCentres) ? selectedCentres : (selectedCentres ? [selectedCentres] : []);
    this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
    this.fetchEleves();
  }

  /**
   * Gère la sélection d'aspects/types de membres (multiselect)
   * @param selectedAspects - Tableau des aspects sélectionnés
   */
  onAspectSelection(selectedAspects: any): void {
    // Conversion des valeurs string en number pour l'API
    const aspectIds = Array.isArray(selectedAspects) 
      ? selectedAspects.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
      : (selectedAspects ? [parseInt(selectedAspects, 10)].filter(id => !isNaN(id)) : []);
    
    this.selectedAspects = aspectIds;
    this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
    this.fetchEleves();
  }

  /**
   * Gère la sélection multiple des statuts
   * @param selectedStatuts - Les statuts sélectionnés (peut être un tableau ou une valeur unique)
   */
  onStatutSelection(selectedStatuts: any): void {
    // Conversion des valeurs en number pour l'API
    const statutIds = Array.isArray(selectedStatuts) 
      ? selectedStatuts.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
      : (selectedStatuts ? [parseInt(selectedStatuts, 10)].filter(id => !isNaN(id)) : []);
    
    this.selectedStatuts = statutIds;
    this.currentPage = 0; // Reset à la première page lors d'un nouveau filtre
    this.fetchEleves();
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



  openEleveDetailById(id: number): void {

      this.rs.apiRegistreMembresMembreIdGet(id).subscribe({
        next: (response: MembreDTO) => {
          this.openEleveDetail(response);
        },
        error: (error) => {
          console.error('Erreur lors de la recherche de l\'élève:', error);
          this.router.navigate(['/registre/fiches/eleves']);
        }
      });
  }

  /**
   * Ouvre effectivement la sidenav avec le détail de l'élève
   * @param eleve - L'élève dont on veut afficher le détail
   */
  openEleveDetail(eleve: MembreDTO): void {
    this.eleveDetailService.setEleve(eleve);
    this.sidenavService
      .setComponent(EleveDetailComponent)
      .setTitle('🧾 Détail de l\'élève id: ' + eleve.id)
      .setWidth('500px')
      .open();
  }

  /**
   * Bascule l'état d'expansion du panneau de filtres
   */
  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }
}
