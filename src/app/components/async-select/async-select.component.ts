import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface AsyncSelectOption {
  value: any;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-async-select',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field appearance="outline" class="w-100">
      <mat-label>{{ label }}</mat-label>
      <mat-select 
        [formControl]="selectControl" 
        [placeholder]="placeholder"
        [multiple]="multiple">
        @if (!multiple) {
          <mat-option value="">
            <em>{{ clearOptionText }}</em>
          </mat-option>
        }
        @if (loading$ | async) {
          <mat-option disabled>
            <mat-spinner diameter="20"></mat-spinner>
            Chargement...
          </mat-option>
        } @else {
          @for (option of options$ | async; track option.value) {
            <mat-option [value]="option.value">
              @if (option.icon) {
                <mat-icon [style.color]="getOptionColor(option)">{{ option.icon }}</mat-icon>
              }
              {{ option.label }}
            </mat-option>
          }
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class AsyncSelectComponent implements OnInit {
  @Input() label: string = 'Sélectionner';
  @Input() placeholder: string = 'Choisissez une option';
  @Input() clearOptionText: string = 'Aucun filtre';
  @Input() multiple: boolean = false;
  @Input() options$!: Observable<AsyncSelectOption[]>;
  @Input() loading$: Observable<boolean> = new BehaviorSubject(false);
  @Input() optionColor?: (option: AsyncSelectOption) => string;
  
  @Output() selectionChange = new EventEmitter<any>();

  selectControl = new FormControl();

  ngOnInit(): void {
    this.selectControl.valueChanges.subscribe(value => {
      this.selectionChange.emit(value);
    });
  }

  /**
   * Permet de définir la valeur sélectionnée depuis l'extérieur
   */
  setValue(value: any): void {
    this.selectControl.setValue(value);
  }

  /**
   * Réinitialise la sélection
   */
  clear(): void {
    this.selectControl.setValue(this.multiple ? [] : '');
  }

  /**
   * Retourne la couleur pour une option avec icône
   */
  getOptionColor(option: AsyncSelectOption): string {
    return this.optionColor ? this.optionColor(option) : 'inherit';
  }
}
