import { Component, inject, OnInit, input, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MembreDTO, RegistreService, CentreDTO, TypeMembreDTO, CiviliteDTO, StatutMembreDTO } from 'src/app/core/helios-api-client';
import { RegistreModuleService } from '../../services/registre-module.service';
import { AsyncSelectComponent } from 'src/app/components/async-select/async-select.component';

@Component({
  selector: 'app-eleve-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './eleve-form.component.html',
  styleUrl: './eleve-form.component.scss'
})
export class EleveFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly rs = inject(RegistreService);
  private readonly registre = inject(RegistreModuleService);

  // Input signal pour l'élève à éditer (optionnel)
  membre = input<MembreDTO | null>(null);
  
  // Signal pour déterminer si on est en mode édition
  isEditMode = computed(() => this.membre() !== null);
  
  // Signaux pour les données de référence
  civilites = signal<CiviliteDTO[]>([]);
  
  // Options pour les sélecteurs
  centresOptions = computed(() => this.registre.centres().data);
  aspectsOptions = computed(() => this.registre.aspects().data);
  statutsOptions = computed(() => this.registre.statuts().data);
  
  // Loading states
  centresLoading = computed(() => this.registre.centres().loading);
  aspectsLoading = computed(() => this.registre.aspects().loading);
  statutsLoading = computed(() => this.registre.statuts().loading);
  civiliteLoading = signal(false);
  
  // Formulaire
  eleveForm: FormGroup;
  
  // État de sauvegarde
  saving = signal(false);

  constructor() {
    // Initialisation du formulaire
    this.eleveForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: [null],
      civilite: [null, Validators.required],
      typeMembre: [null, Validators.required],
      centre: [null, Validators.required],
      statut: [null, Validators.required],
      email: ['', [Validators.email]],
      emailValide: [false],
      telephone: [''],
      portable: [''],
      adresse: [''],
      codePostal: [''],
      ville: [''],
      pays: [''],
      commentaires: [''],
      connaissances: [''],
      profession: ['']
    });

    // Effect pour pré-remplir le formulaire en mode édition
    effect(() => {
      const membreData = this.membre();
      if (membreData) {
        this.eleveForm.patchValue({
          nom: membreData.nom,
          prenom: membreData.prenom,
          dateNaissance: membreData.dateNaissance ? new Date(membreData.dateNaissance) : null,
          civilite: membreData.civilite,
          typeMembre: membreData.typeMembre,
          centre: membreData.centre,
          statut: membreData.statut,
          email: membreData.email,
          emailValide: membreData.emailValide,
          telephone: membreData.telephone,
          portable: membreData.portable,
          adresse: membreData.adresse,
          codePostal: membreData.codePostal,
          ville: membreData.ville,
          pays: membreData.pays,
          commentaires: membreData.commentaires,
          connaissances: membreData.connaissances,
          profession: membreData.profession
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadCivilites();
  }

  private loadCivilites(): void {
    this.civiliteLoading.set(true);
    // Pour l'instant, on crée des civilités par défaut car l'API n'a pas l'endpoint
    const defaultCivilites: CiviliteDTO[] = [
      { id: 1, libelle: 'M.', code: null },
      { id: 2, libelle: 'Mme', code: null },
      { id: 3, libelle: 'Mlle', code: null }
    ];
    this.civilites.set(defaultCivilites);
    this.civiliteLoading.set(false);
  }

  onSubmit(): void {
    if (this.eleveForm.valid) {
      this.saving.set(true);
      
      const formValue = this.eleveForm.value;
      const membreData: MembreDTO = {
        ...formValue,
        id: this.isEditMode() ? this.membre()!.id : 0,
        dateNaissance: formValue.dateNaissance ? formValue.dateNaissance.toISOString().split('T')[0] : null
      };

      if (this.isEditMode()) {
        // Mode édition
        this.rs.apiRegistreMembresMembreIdPut(membreData, membreData.id).subscribe({
          next: () => {
            this.saving.set(false);
            // TODO: Ajouter notification de succès
            console.log('Membre mis à jour avec succès');
          },
          error: (error) => {
            this.saving.set(false);
            // TODO: Ajouter gestion d'erreur
            console.error('Erreur lors de la mise à jour:', error);
          }
        });
      } else {
        // Mode création
        this.rs.apiRegistreMembresMembrePost(membreData).subscribe({
          next: () => {
            this.saving.set(false);
            // TODO: Ajouter notification de succès
            console.log('Membre créé avec succès');
            this.eleveForm.reset();
          },
          error: (error) => {
            this.saving.set(false);
            // TODO: Ajouter gestion d'erreur
            console.error('Erreur lors de la création:', error);
          }
        });
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.eleveForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.eleveForm.reset();
  }

  // Getters pour les erreurs de validation
  getErrorMessage(fieldName: string): string {
    const control = this.eleveForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Minimum ${requiredLength} caractères requis`;
    }
    if (control?.hasError('email')) {
      return 'Format d\'email invalide';
    }
    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.eleveForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
}
