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
import { SidenavService } from 'src/app/services/sidenav.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarService } from 'src/app/layouts/full/shared/snack-bar/snack-bar.service';

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
export class EleveFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rs = inject(RegistreService);
  private readonly rsModule = inject(RegistreModuleService);
  private readonly sidenav = inject(SidenavService);
  private readonly snackBar = inject(SnackBarService);

  // Input signal pour l'élève à éditer (optionnel)
  membre = input<MembreDTO | null>(null);
  
  _membre = computed(() => this.membre()?? this.rsModule.eleve());


  // Signal pour déterminer si on est en mode édition
  isEditMode = computed(() => this._membre() !== null);
  
  
  // Options pour les sélecteurs
  centresOptions = computed(() => this.rsModule.centres().data);
  aspectsOptions = computed(() => this.rsModule.aspects().data);
  statutsOptions = computed(() => this.rsModule.statuts().data);
  civilitesOptions = computed(() => this.rsModule.civilites().data);
  // Loading states
  centresLoading = computed(() => this.rsModule.centres().loading);
  aspectsLoading = computed(() => this.rsModule.aspects().loading);
  statutsLoading = computed(() => this.rsModule.statuts().loading);
  civiliteLoading =computed(() => this.rsModule.civilites().loading);
  
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

      const membreData = this._membre();
      // S'assurer que les données de référence sont chargées avant d'initialiser
      const civilites = this.civilitesOptions();
      const centres = this.centresOptions();
      const aspects = this.aspectsOptions();
      const statuts = this.statutsOptions();


      if (membreData && civilites.length > 0 && centres.length > 0 && aspects.length > 0 && statuts.length > 0) {
        // Trouver les bonnes références dans les listes d'options
        const civiliteMatch = civilites.find(c => c.id === membreData.civilite?.id);
        const centreMatch = centres.find(c => c.id === membreData.centre?.id);
        const typeMembreMatch = aspects.find(t => t.id === membreData.typeMembre?.id);
        const statutMatch = statuts.find(s => s.id === membreData.statut?.id);
        

        this.eleveForm.patchValue({
          ...membreData,
          dateNaissance: membreData.dateNaissance ? new Date(membreData.dateNaissance) : null,
          civilite: civiliteMatch || membreData.civilite,
          typeMembre: typeMembreMatch || membreData.typeMembre,
          centre: centreMatch || membreData.centre,
          statut: statutMatch || membreData.statut
        });
      }
    });
  }




  onSubmit(): void {
    if (this.eleveForm.valid) {
      this.saving.set(true);
      
      const formValue = this.eleveForm.value;
      const membreData: MembreDTO = {
        ...formValue,
        id: this.isEditMode() ? this._membre()!.id : 0,
        dateNaissance: formValue.dateNaissance ? formValue.dateNaissance.toISOString().split('T')[0] : null
      };

      if (this.isEditMode()) {
        // Mode édition
        this.rs.apiRegistreMembresMembreIdPut(membreData, membreData.id).subscribe({
          next: () => {
            this.saving.set(false);
            this.snackBar.success('Mise à jour terminée avec succès');

          },
          error: (error) => {
            this.saving.set(false);
            this.snackBar.error('Erreur lors de la mise à jour');
            console.error('Erreur lors de la mise à jour:', error);
          }
        });
      } else {
        // Mode création
        this.rs.apiRegistreMembresMembrePost(membreData).subscribe({
          next: () => {
            this.saving.set(false);
            this.snackBar.success('Membre créé avec succès');
            console.log('Membre créé avec succès');
            this.eleveForm.reset();
          },
          error: (error) => {
            this.saving.set(false);
            this.snackBar.error('Erreur lors de la création');
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
    if (this.isEditMode()) {
      this.sidenav.close();
      return;
    }
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
