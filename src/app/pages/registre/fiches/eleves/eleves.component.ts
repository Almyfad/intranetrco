import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MembreDTO, RegistreService, DataPagerOfMembreDTO, MembreFiltre, CentreDTO, TypeMembreDTO, StatutMembreDTO, NullableOfStatutsMembres } from 'src/app/core/helios-api-client';
import { MatTableDataSource } from '@angular/material/table';
import { SidenavService } from 'src/app/services/sidenav.service';
import { EleveDetailComponent } from '../eleve-detail/eleve-detail.component';

import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { StatutMembreComponent } from '../../statut-membre/statut-membre.component';
import { AsyncSelectComponent, AsyncSelectOption } from 'src/app/components/async-select/async-select.component';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, map, BehaviorSubject, Observable } from 'rxjs';

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
  private readonly rs = inject(RegistreService);
  private readonly sidenavService = inject(SidenavService);
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
  centresLoading$ = new BehaviorSubject<boolean>(false);
  centresOptions$: Observable<AsyncSelectOption[]>;
  selectedCentres: string[] = [];

  // Propriétés pour le filtre aspects (types membres)
  aspectsLoading$ = new BehaviorSubject<boolean>(false);
  aspectsOptions$: Observable<AsyncSelectOption[]>;
  selectedAspects: number[] = [];

  // Propriétés pour le filtre statuts
  statutsLoading$ = new BehaviorSubject<boolean>(false);
  statutsOptions$: Observable<AsyncSelectOption[]>;
  selectedStatuts: number[] = [];

  constructor() {
    // Initialisation de l'observable pour les centres
    this.centresOptions$ = this.rs.apiRegistreCentresGet().pipe(
      map((centres: CentreDTO[]) => 
        centres.map(centre => ({
          value: centre.libelle,
          label: centre.libelle || 'Centre sans nom'
        }))
      )
    );

    // Initialisation de l'observable pour les aspects (types membres)
    this.aspectsOptions$ = this.rs.apiRegistreAspectsGet().pipe(
      map((aspects: TypeMembreDTO[]) => 
        aspects.map(aspect => ({
          value: aspect.id?.toString() || '',
          label: aspect.libelle || 'Type membre sans nom'
        }))
      )
    );

    // Initialisation de l'observable pour les statuts
    this.statutsOptions$ = this.rs.apiRegistreStatutsGet().pipe(
      map((statuts: StatutMembreDTO[]) => 
        statuts.map(statut => ({
          value: statut.id || 0,
          label: statut.libelle || 'Statut sans nom',
          icon: this.getStatutIcon(statut.code as NullableOfStatutsMembres)
        }))
      )
    );
  }

  ngOnInit(): void {
    this.fetchEleves();
    this.setupFilters();
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
    this.rs.apiRegistreMembresPost(this.currentPage + 1, this.pageSize, filter, 'body').subscribe({
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
   * Retourne la couleur pour un statut donné
   * @param option - L'option de statut
   */
  getStatutColor(option: AsyncSelectOption): string {
    switch (option.value) {
      case 0: // Present
        return 'green';
      case 1: // Suivi
        return 'blue';
      case 3: // Demissionnaire
        return 'orange';
      case 4: // Decede
        return 'gray';
      default:
        return 'gray';
    }
  }

  /**
   * Retourne l'icône pour un statut donné
   * @param code - Le code du statut
   */
  getStatutIcon(code: NullableOfStatutsMembres | null): string {
    if (!code) {
      return 'point';
    }

    switch (code) {
      case NullableOfStatutsMembres.Present:
        return 'point';
      case NullableOfStatutsMembres.Suivi:
        return 'eye-spark';
      case NullableOfStatutsMembres.Demissionnaire:
        return 'user-cancel';
      case NullableOfStatutsMembres.Decede:
        return 'user-x';
      default:
        return 'point';
    }
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
