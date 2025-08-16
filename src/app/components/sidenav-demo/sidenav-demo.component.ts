import { Component } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { CustomizerComponent } from 'src/app/layouts/full/shared/customizer/customizer.component';
import { AlternativeCustomizerComponent } from 'src/app/layouts/full/shared/alternative-customizer/alternative-customizer.component';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-sidenav-demo',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Démonstration du Service Sidenav</h2>
          <p class="card-subtitle">Testez toutes les fonctionnalités du service sidenav</p>
        </div>
        
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <div class="d-flex flex-column gap-16">
                <button 
                  mat-raised-button 
                  color="primary" 
                  (click)="openSidenav()"
                >
                  <mat-icon>open_in_new</mat-icon>
                  Ouvrir la Sidenav
                </button>
                
                <button 
                  mat-raised-button 
                  color="accent" 
                  (click)="closeSidenav()"
                >
                  <mat-icon>close</mat-icon>
                  Fermer la Sidenav
                </button>
                
                <button 
                  mat-raised-button 
                  (click)="toggleSidenav()"
                >
                  <mat-icon>swap_horiz</mat-icon>
                  Toggle Sidenav
                </button>
                
                <button 
                  mat-raised-button 
                  color="warn" 
                  (click)="switchToDefaultCustomizer()"
                >
                  <mat-icon>settings</mat-icon>
                  Charger Customizer par défaut
                </button>
                
                <button 
                  mat-raised-button 
                  color="warn" 
                  (click)="switchToAlternativeCustomizer()"
                >
                  <mat-icon>tune</mat-icon>
                  Charger Customizer alternatif
                </button>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card bg-light">
                <div class="card-header">
                  <h4 class="card-title">État actuel</h4>
                </div>
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <mat-icon [color]="isOpen ? 'primary' : 'warn'">
                      {{ isOpen ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                    <span class="ms-2">Sidenav ouverte: <strong>{{ isOpen ? 'Oui' : 'Non' }}</strong></span>
                  </div>
                  <div class="d-flex align-items-center">
                    <mat-icon color="accent">widgets</mat-icon>
                    <span class="ms-2">Composant: <strong>{{ currentComponentName }}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gap-16 {
      gap: 16px;
    }
  `]
})
export class SidenavDemoComponent {
  isOpen = false;
  currentComponentName = 'Aucun';

  constructor(private sidenavService: SidenavService) {
    // Écoute les changements d'état
    this.sidenavService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });

    this.sidenavService.currentComponent$.subscribe(component => {
      if (component === CustomizerComponent) {
        this.currentComponentName = 'CustomizerComponent';
      } else if (component === AlternativeCustomizerComponent) {
        this.currentComponentName = 'AlternativeCustomizerComponent';
      } else {
        this.currentComponentName = 'Aucun';
      }
    });
  }

  openSidenav(): void {
    this.sidenavService.open();
  }

  closeSidenav(): void {
    this.sidenavService.close();
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }

  switchToDefaultCustomizer(): void {
    this.sidenavService.setComponent(CustomizerComponent);
    this.sidenavService.open();
  }

  switchToAlternativeCustomizer(): void {
    this.sidenavService.setComponent(AlternativeCustomizerComponent);
    this.sidenavService.open();
  }
}
