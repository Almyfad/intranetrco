import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-editable-label',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './editable-label.component.html',
  styleUrl: './editable-label.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableLabelComponent),
      multi: true
    }
  ]
})
export class EditableLabelComponent implements ControlValueAccessor {
  @Input() editMode?: boolean; // Permet au parent de contrôler l'édition (optionnel)
  @Input() showIcon: boolean = true; // Affiche l'icône de crayon
  @Input() matlabel: string | undefined | null; // Affiche l'icône de crayon
  @Output() editModeChange = new EventEmitter<boolean>(); // Notifie le parent
  @Output() onValidated = new EventEmitter<string>(); // Notifie le parent
  private internalEditMode: boolean = false; // Mode édition géré en interne
  tempValue: string = ''; // Stocke la valeur temporaire avant validation

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  get isEditMode(): boolean {
    return this.editMode !== undefined ? this.editMode : this.internalEditMode;
  }

  set isEditMode(value: boolean) {
    if (this.editMode !== undefined) {
      this.editModeChange.emit(value);
    } else {
      this.internalEditMode = value;
    }

    if (value) {
      this.tempValue = this.value;
    }
  }
  private _value: string = '';
  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val); // Notifie Angular du changement de valeur
  }

  writeValue(value: string): void {
    this._value = value;
    this.tempValue = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }
  validateEdit() {
    this.value = this.tempValue;
    this.isEditMode = false;
    this.onValidated.emit(this.value);
  }

  cancelEdit() {
    this.tempValue = this.value;
    this.isEditMode = false;
  }






}
