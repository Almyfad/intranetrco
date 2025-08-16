import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { AppSettings } from 'src/app/config';
import { CoreService } from 'src/app/services/core.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-alternative-customizer',
  imports: [TablerIconsModule, MaterialModule, FormsModule, NgScrollbarModule],
  template: `
    <ng-scrollbar class="position-relative" style="height: calc(100vh - 80px)">
      <div class="p-24">
        <h4 class="f-w-600 m-b-16">Alternative Customizer</h4>
        <p class="m-b-24">Ceci est un composant customizer alternatif.</p>
        
        <div class="d-flex flex-column">
          <mat-slide-toggle
            [checked]="options.theme === 'dark'"
            (change)="setDarkTheme($event.checked)"
            class="m-b-16"
          >
            Mode sombre
          </mat-slide-toggle>

          <mat-slide-toggle
            [checked]="options.horizontal"
            (change)="setHorizontalLayout($event.checked)"
            class="m-b-16"
          >
            Layout horizontal
          </mat-slide-toggle>

          <mat-slide-toggle
            [checked]="options.cardBorder"
            (change)="setCardBorder($event.checked)"
            class="m-b-16"
          >
            Bordures de cartes
          </mat-slide-toggle>

          <div class="m-t-24">
            <button 
              mat-raised-button 
              color="primary" 
              (click)="resetToDefault()"
              class="w-100"
            >
              Réinitialiser par défaut
            </button>
          </div>
        </div>
      </div>
    </ng-scrollbar>
  `,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class AlternativeCustomizerComponent {
  options = this.settings.getOptions();

  @Output() optionsChange = new EventEmitter<AppSettings>();

  constructor(private settings: CoreService) {}

  setDarkTheme(checked: boolean): void {
    this.options.theme = checked ? 'dark' : 'light';
    this.settings.setOptions(this.options);
    this.optionsChange.emit(this.options);
  }

  setHorizontalLayout(checked: boolean): void {
    this.options.horizontal = checked;
    this.settings.setOptions(this.options);
    this.optionsChange.emit(this.options);
  }

  setCardBorder(checked: boolean): void {
    this.options.cardBorder = checked;
    this.settings.setOptions(this.options);
    this.optionsChange.emit(this.options);
  }

  resetToDefault(): void {
    this.options = {
      theme: 'light',
      dir: 'ltr',
      cardBorder: false,
      horizontal: false,
      sidenavOpened: true,
      sidenavCollapsed: false,
      navPos: 'side',
      activeTheme: 'default',
      boxed: true,
      language: 'en'
    };
    this.settings.setOptions(this.options);
    this.optionsChange.emit(this.options);
  }
}
