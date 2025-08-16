import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-alternative-customizer-page',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Customizer Alternatif</h2>
          <p class="card-subtitle">Version alternative du composant customizer avec interface simplifiée</p>
        </div>
        
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="card bg-light">
                <div class="card-header">
                  <h4 class="card-title">À propos de ce composant</h4>
                </div>
                <div class="card-body">
                  <p>Ce composant customizer alternatif propose une interface plus simple avec :</p>
                  <ul>
                    <li><mat-icon class="icon-inline">dark_mode</mat-icon> Toggle pour le mode sombre</li>
                    <li><mat-icon class="icon-inline">view_column</mat-icon> Toggle pour le layout horizontal</li>
                    <li><mat-icon class="icon-inline">border_style</mat-icon> Toggle pour les bordures de cartes</li>
                    <li><mat-icon class="icon-inline">restore</mat-icon> Bouton de réinitialisation</li>
                  </ul>
                  <div class="alert alert-info">
                    <mat-icon class="icon-inline">info</mat-icon>
                    <strong>Note :</strong> Ce composant peut être chargé dynamiquement dans la sidenav 
                    à l'aide du service SidenavService.
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Utilisation avec le service</h4>
                </div>
                <div class="card-body">
                  <p>Pour charger ce composant dans la sidenav :</p>
                  <div class="bg-light p-3 rounded">
                    <p class="mb-2"><strong>1. Injection du service :</strong></p>
                    <code>constructor(private sidenavService: SidenavService)</code>
                    
                    <p class="mb-2 mt-3"><strong>2. Charger le composant :</strong></p>
                    <code>this.sidenavService.setComponent(AlternativeCustomizerComponent);</code>
                    <br>
                    <code>this.sidenavService.open();</code>
                  </div>
                  
                  <div class="mt-3">
                    <p class="text-muted">
                      <mat-icon class="icon-inline">tips_and_updates</mat-icon>
                      <strong>Conseil :</strong> Testez le service avec la page "Demo Service Sidenav" 
                      disponible dans les Quick Links.
                    </p>
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
    .card {
      margin-bottom: 1rem;
    }
    .icon-inline {
      vertical-align: middle;
      margin-right: 0.5rem;
      font-size: 1.2rem;
    }
    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #bee5eb;
      background-color: #d1ecf1;
      color: #0c5460;
    }
    pre {
      overflow-x: auto;
    }
    code {
      font-size: 0.875rem;
    }
  `]
})
export class AlternativeCustomizerPageComponent {}
