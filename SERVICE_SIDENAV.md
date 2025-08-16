# Service Sidenav

Ce service permet de gérer dynamiquement la sidenav customizer et de changer les composants affichés à l'intérieur.

## Fonctionnalités

- **Contrôle de la sidenav** : Ouvrir, fermer, toggle
- **Changement dynamique de composants** : Remplacer le composant affiché dans la sidenav
- **Gestion des options** : Écouter et émettre les changements d'options
- **Observables** : États réactifs pour l'état de la sidenav et le composant actuel

## Installation et Configuration

Le service est déjà configuré dans `src/app/services/sidenav.service.ts` et injecté dans le composant `FullComponent`.

## Utilisation

### 1. Injection du service

```typescript
import { SidenavService } from 'src/app/services/sidenav.service';

constructor(private sidenavService: SidenavService) {}
```

### 2. Contrôle de base de la sidenav

```typescript
// Ouvrir la sidenav
this.sidenavService.open();

// Fermer la sidenav
this.sidenavService.close();

// Toggle (ouvrir/fermer)
this.sidenavService.toggle();

// Vérifier si elle est ouverte
const isOpen = this.sidenavService.isOpen();
```

### 3. Changement de composant

```typescript
import { CustomizerComponent } from 'src/app/layouts/full/shared/customizer/customizer.component';
import { AlternativeCustomizerComponent } from 'src/app/layouts/full/shared/alternative-customizer/alternative-customizer.component';

// Charger le customizer par défaut
this.sidenavService.setComponent(CustomizerComponent);

// Charger le customizer alternatif
this.sidenavService.setComponent(AlternativeCustomizerComponent);

// Charger un composant avec des inputs
this.sidenavService.setComponent(MonComposant, { 
  propriete1: 'valeur1',
  propriete2: 'valeur2'
});
```

### 4. Écoute des changements d'état

```typescript
// Écouter l'état d'ouverture/fermeture
this.sidenavService.isOpen$.subscribe(isOpen => {
  console.log('Sidenav ouverte:', isOpen);
});

// Écouter le composant actuel
this.sidenavService.currentComponent$.subscribe(component => {
  console.log('Composant actuel:', component);
});

// Écouter les changements d'options
this.sidenavService.optionsChange$.subscribe(options => {
  if (options) {
    console.log('Nouvelles options:', options);
  }
});
```

### 5. Utilisation dans les templates

Dans le composant `HeaderComponent`, un bouton a été ajouté pour ouvrir le customizer :

```html
<button
  mat-icon-button
  (click)="toggleCustomizer()"
  aria-label="Settings"
>
  <i-tabler name="settings"></i-tabler>
</button>
```

## Exemples d'utilisation

### Exemple 1 : Bouton simple pour ouvrir les settings

```typescript
export class MonComposant {
  constructor(private sidenavService: SidenavService) {}

  openSettings(): void {
    this.sidenavService.open();
  }
}
```

```html
<button mat-button (click)="openSettings()">
  Ouvrir les paramètres
</button>
```

### Exemple 2 : Switcher entre différents customizers

```typescript
export class MonComposant {
  constructor(private sidenavService: SidenavService) {}

  showDefaultCustomizer(): void {
    this.sidenavService.setComponent(CustomizerComponent);
    this.sidenavService.open();
  }

  showAlternativeCustomizer(): void {
    this.sidenavService.setComponent(AlternativeCustomizerComponent);
    this.sidenavService.open();
  }
}
```

### Exemple 3 : Composant avec état réactif

```typescript
export class MonComposant implements OnInit, OnDestroy {
  isOpen$ = this.sidenavService.isOpen$;
  private subscriptions: Subscription[] = [];

  constructor(private sidenavService: SidenavService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.sidenavService.optionsChange$.subscribe(options => {
        if (options) {
          // Traiter les nouvelles options
          this.handleOptionsChange(options);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private handleOptionsChange(options: AppSettings): void {
    // Votre logique ici
  }
}
```

## Création d'un nouveau composant customizer

Pour créer un nouveau composant customizer, suivez cette structure :

```typescript
import { Component, Output, EventEmitter } from '@angular/core';
import { AppSettings } from 'src/app/config';

@Component({
  selector: 'app-mon-customizer',
  template: `
    <!-- Votre template ici -->
  `
})
export class MonCustomizerComponent {
  @Output() optionsChange = new EventEmitter<AppSettings>();

  // Votre logique ici
  
  emitChange(options: AppSettings): void {
    this.optionsChange.emit(options);
  }
}
```

Le service se chargera automatiquement d'écouter l'EventEmitter `optionsChange` si il existe.

## API du Service

### Méthodes

- `open()`: Ouvre la sidenav
- `close()`: Ferme la sidenav
- `toggle()`: Toggle l'état de la sidenav
- `isOpen()`: Retourne l'état actuel (boolean)
- `setComponent<T>(componentType, inputs?)`: Change le composant affiché
- `clearComponent()`: Nettoie le composant actuel
- `getCurrentComponent()`: Retourne le type du composant actuel
- `getCurrentComponentRef()`: Retourne la référence du composant actuel
- `emitOptionsChange(options)`: Émet manuellement des changements d'options

### Observables

- `isOpen$`: Observable<boolean> - État d'ouverture de la sidenav
- `currentComponent$`: Observable<Type<any> | null> - Type du composant actuel
- `optionsChange$`: Observable<AppSettings | null> - Changements d'options

## Migration depuis l'ancien système

### Avant
```html
<app-customizer (optionsChange)="receiveOptions($event)"></app-customizer>
```

### Après
```html
<div #dynamicComponentContainer></div>
```

Le composant est maintenant chargé dynamiquement via le service, permettant de changer de composant à la volée.

## Composant de démonstration

Un composant de démonstration est disponible dans `src/app/components/sidenav-demo/sidenav-demo.component.ts` pour tester toutes les fonctionnalités du service.
